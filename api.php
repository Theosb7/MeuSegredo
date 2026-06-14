<?php
session_start();

$dbPath = __DIR__ . '/data/banco.sqlite';
$dbDir = dirname($dbPath);
if (!is_dir($dbDir)) {
    mkdir($dbDir, 0777, true);
}

try {
    $pdo = new PDO('sqlite:' . $dbPath);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

    // Criar tabelas se não existirem
    $pdo->exec("CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        senha TEXT NOT NULL,
        criado_em TEXT NOT NULL
    )");

    $pdo->exec("CREATE TABLE IF NOT EXISTS usuario_dados (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        usuario_id INTEGER NOT NULL,
        chave TEXT NOT NULL,
        valor TEXT NOT NULL,
        UNIQUE(usuario_id, chave),
        FOREIGN KEY(usuario_id) REFERENCES usuarios(id)
    )");

} catch (Exception $e) {
    die(json_encode(['status' => 'error', 'message' => 'Erro no banco: ' . $e->getMessage()]));
}

$action = isset($_GET['action']) ? $_GET['action'] : '';

if ($action === 'register') {
    $nome = $_POST['nome'] ?? '';
    $email = $_POST['email'] ?? '';
    $senha = $_POST['senha'] ?? '';

    if (empty($nome) || empty($email) || empty($senha)) {
        header("Location: index.html?error=CamposVazios");
        exit;
    }

    try {
        $hash = password_hash($senha, PASSWORD_BCRYPT);
        $stmt = $pdo->prepare("INSERT INTO usuarios (nome, email, senha, criado_em) VALUES (?, ?, ?, ?)");
        $stmt->execute([$nome, $email, $hash, date('Y-m-d H:i:s')]);
        
        // Logar automaticamente após criar conta
        $_SESSION['usuario_id'] = $pdo->lastInsertId();
        $_SESSION['usuario_nome'] = $nome;
        
        header("Location: app.html");
        exit;
    } catch (Exception $e) {
        header("Location: index.html?error=EmailEmUso");
        exit;
    }
}

if ($action === 'login') {
    $email = $_POST['email'] ?? '';
    $senha = $_POST['senha'] ?? '';

    $stmt = $pdo->prepare("SELECT * FROM usuarios WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if ($user && password_verify($senha, $user['senha'])) {
        $_SESSION['usuario_id'] = $user['id'];
        $_SESSION['usuario_nome'] = $user['nome'];
        header("Location: app.html");
        exit;
    } else {
        header("Location: login.html?error=CredenciaisInvalidas");
        exit;
    }
}

if ($action === 'logout') {
    session_destroy();
    header("Location: index.html");
    exit;
}

// Retorna o status atual do usuário logado (usado pelo app.html)
if ($action === 'session') {
    header('Content-Type: application/json');
    if (isset($_SESSION['usuario_id'])) {
        echo json_encode(['logged_in' => true, 'nome' => $_SESSION['usuario_nome']]);
    } else {
        echo json_encode(['logged_in' => false]);
    }
    exit;
}

// API PARA SALVAR E CARREGAR DADOS DO USUÁRIO
if ($action === 'sync') {
    header('Content-Type: application/json');
    
    if (!isset($_SESSION['usuario_id'])) {
        echo json_encode(['status' => 'error', 'message' => 'Não autenticado']);
        exit;
    }
    
    $userId = $_SESSION['usuario_id'];

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $data = json_decode(file_get_contents('php://input'), true);
        if (!$data || !isset($data['key']) || !isset($data['value'])) {
            echo json_encode(['status' => 'error', 'message' => 'Dados inválidos']);
            exit;
        }

        $stmt = $pdo->prepare("INSERT INTO usuario_dados (usuario_id, chave, valor) VALUES (?, ?, ?) 
                               ON CONFLICT(usuario_id, chave) DO UPDATE SET valor = excluded.valor");
        $stmt->execute([$userId, $data['key'], json_encode($data['value'])]);
        echo json_encode(['status' => 'success']);
        exit;
    }

    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $key = $_GET['key'] ?? '';
        if (empty($key)) {
            // Retorna tudo
            $stmt = $pdo->prepare("SELECT chave, valor FROM usuario_dados WHERE usuario_id = ?");
            $stmt->execute([$userId]);
            $results = [];
            while ($row = $stmt->fetch()) {
                $results[$row['chave']] = json_decode($row['valor'], true);
            }
            echo json_encode(['status' => 'success', 'data' => $results]);
            exit;
        }

        $stmt = $pdo->prepare("SELECT valor FROM usuario_dados WHERE usuario_id = ? AND chave = ?");
        $stmt->execute([$userId, $key]);
        $row = $stmt->fetch();
        
        if ($row) {
            echo json_encode(['status' => 'success', 'data' => json_decode($row['valor'], true)]);
        } else {
            echo json_encode(['status' => 'success', 'data' => null]);
        }
        exit;
    }
}

if ($action === 'delete_account') {
    header('Content-Type: application/json');
    if (!isset($_SESSION['usuario_id'])) {
        echo json_encode(['status' => 'error', 'message' => 'Não autenticado']);
        exit;
    }

    $userId = $_SESSION['usuario_id'];
    try {
        $pdo->beginTransaction();

        // Excluir dados do usuário
        $stmt = $pdo->prepare("DELETE FROM usuario_dados WHERE usuario_id = ?");
        $stmt->execute([$userId]);

        // Excluir usuário
        $stmt2 = $pdo->prepare("DELETE FROM usuarios WHERE id = ?");
        $stmt2->execute([$userId]);

        $pdo->commit();

        // Destruir sessão
        session_destroy();

        echo json_encode(['status' => 'success']);
        exit;
    } catch (Exception $e) {
        if ($pdo->inTransaction()) {
            $pdo->rollBack();
        }
        echo json_encode(['status' => 'error', 'message' => 'Erro ao excluir conta: ' . $e->getMessage()]);
        exit;
    }
}

// Se não for nenhuma ação, retorna 404
header("HTTP/1.0 404 Not Found");
echo "Endpoint API inválido.";
