<?php

/**
 * Router - Roteador
 * 
 * Avalia a URL e o método HTTP da requisição.
 * GET  → exibe o formulário (view.php)
 * POST → passa pelo Middleware e aciona o Controller
 */

require_once __DIR__ . '/middleware.php';
require_once __DIR__ . '/controller.php';

class Router
{
    /**
     * Roteia a requisição com base no método HTTP.
     */
    public function handle(): void
    {
        $metodo = $_SERVER['REQUEST_METHOD'];

        if ($metodo === 'GET') {
            // Exibe o formulário
            require __DIR__ . '/view.php';

        } elseif ($metodo === 'POST') {
            try {
                // 1. Middleware valida os dados antes de chegar ao Controller
                $dadosValidados = Middleware::validar($_POST);

                // 2. Controller processa a matrícula
                $controller = new MatriculaController();
                $controller->processarMatricula(
                    $dadosValidados['nome'],
                    $dadosValidados['idade'],
                    $dadosValidados['curso']
                );

            } catch (Exception $e) {
                // Se o Middleware barrar, exibe o aviso na view
                $mensagem = $e->getMessage();
                $tipo = 'aviso';
                require __DIR__ . '/view.php';
            }

        } else {
            http_response_code(405);
            echo "Método não permitido.";
        }
    }
}
