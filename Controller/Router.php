<?php
require_once __DIR__ . '/AuthController.php';
require_once __DIR__ . '/SyncController.php';
require_once __DIR__ . '/AccountController.php';

class Router {
    public static function dispatch() {
        session_start();

        $action = isset($_GET['action']) ? $_GET['action'] : '';

        // If no action provided, serve appropriate front page
        if (empty($action)) {
            if (isset($_SESSION['usuario_id'])) {
                header('Location: /app.html');
                exit;
            }
            header('Location: /index.html');
            exit;
        }

        switch ($action) {
            case 'register':
                AuthController::register();
                break;
            case 'login':
                AuthController::login();
                break;
            case 'logout':
                AuthController::logout();
                break;
            case 'session':
                AuthController::session();
                break;
            case 'sync':
                SyncController::handle();
                break;
            case 'delete_account':
                AccountController::delete();
                break;
            default:
                header("HTTP/1.0 404 Not Found");
                echo "Endpoint API inválido.";
                break;
        }
    }
}
