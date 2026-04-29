<?php

/**
 * Index - Front Controller
 * 
 * Ponto de entrada único da aplicação.
 * Recebe todas as requisições do navegador e aciona o Router.
 */

require_once __DIR__ . '/router.php';

$router = new Router();
$router->handle();
