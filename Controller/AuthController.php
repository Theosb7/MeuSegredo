<?php
require_once __DIR__ . '/../Services/AuthService.php';

class AuthController {
    public static function register() {
        $nome = $_POST['nome'] ?? '';
        $email = $_POST['email'] ?? '';
        $senha = $_POST['senha'] ?? '';

        if (empty($nome) || empty($email) || empty($senha)) {
            header("Location: ../index.html?error=CamposVazios");
            exit;
        }

        try {
            $userId = AuthService::register($nome, $email, $senha);

            $_SESSION['usuario_id'] = $userId;
            $_SESSION['usuario_nome'] = $nome;

            header("Location: ../app.html");
            exit;
        } catch (Exception $e) {
            header("Location: ../index.html?error=EmailEmUso");
            exit;
        }
    }

    public static function login() {
        $email = $_POST['email'] ?? '';
        $senha = $_POST['senha'] ?? '';

        $user = AuthService::authenticate($email, $senha);

        if ($user) {
            $_SESSION['usuario_id'] = $user['id'];
            $_SESSION['usuario_nome'] = $user['nome'];
            header("Location: ../app.html");
            exit;
        } else {
            header("Location: ../login.html?error=CredenciaisInvalidas");
            exit;
        }
    }

    public static function logout() {
        session_destroy();
        header("Location: ../index.html");
        exit;
    }

    public static function session() {
        header('Content-Type: application/json');
        if (isset($_SESSION['usuario_id'])) {
            echo json_encode(['logged_in' => true, 'nome' => $_SESSION['usuario_nome']]);
        } else {
            echo json_encode(['logged_in' => false]);
        }
        exit;
    }
}
