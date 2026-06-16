<?php
require_once __DIR__ . '/../Model/Database.php';
require_once __DIR__ . '/../Model/User.php';
require_once __DIR__ . '/../Model/UserData.php';

class AccountController {
    public static function delete() {
        header('Content-Type: application/json');
        if (!isset($_SESSION['usuario_id'])) {
            echo json_encode(['status' => 'error', 'message' => 'Não autenticado']);
            exit;
        }

        $userId = $_SESSION['usuario_id'];
        $pdo = Database::getConnection();
        
        try {
            $pdo->beginTransaction();

            UserData::deleteAll($userId);
            User::delete($userId);

            $pdo->commit();

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
}
