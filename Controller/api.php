<?php
session_start();

require_once __DIR__ . '/AuthController.php';
require_once __DIR__ . '/SyncController.php';
require_once __DIR__ . '/AccountController.php';

$action = isset($_GET['action']) ? $_GET['action'] : '';

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
