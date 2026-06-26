<?php
// Front controller: entrada da aplicação e roteador
require_once __DIR__ . '/Controller/Router.php';

// Dispatch request based on ?action=...
Router::dispatch();
