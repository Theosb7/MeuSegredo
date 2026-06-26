<?php
require_once __DIR__ . '/../Services/SyncService.php';

class SyncController {
    public static function handle() {
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

            SyncService::saveKey($userId, $data['key'], $data['value']);
            echo json_encode(['status' => 'success']);
            exit;
        }

        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            $key = $_GET['key'] ?? '';
            if (empty($key)) {
                $results = SyncService::getAll($userId);
                echo json_encode(['status' => 'success', 'data' => $results]);
                exit;
            }

            $value = SyncService::getByKey($userId, $key);
            echo json_encode(['status' => 'success', 'data' => $value]);
            exit;
        }
    }
}
