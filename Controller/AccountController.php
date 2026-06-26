<?php
require_once __DIR__ . '/../Services/UserService.php';

class AccountController {
    public static function delete() {
        header('Content-Type: application/json');
        if (!isset($_SESSION['usuario_id'])) {
            echo json_encode(['status' => 'error', 'message' => 'Não autenticado']);
            exit;
        }

        $userId = $_SESSION['usuario_id'];

        try {
            UserService::deleteAccount($userId);
            session_destroy();
            echo json_encode(['status' => 'success']);
            exit;
        } catch (Exception $e) {
            echo json_encode(['status' => 'error', 'message' => 'Erro ao excluir conta: ' . $e->getMessage()]);
            exit;
        }
    }
}
