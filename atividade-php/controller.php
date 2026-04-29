<?php

/**
 * Controller - MatriculaController
 * 
 * O "maestro" do processo. Recebe os dados da requisição, chama o Service
 * para aplicar as regras e, se aprovado, instancia o Model para salvar no SQLite.
 */

require_once __DIR__ . '/service.php';
require_once __DIR__ . '/model.php';

class MatriculaController
{
    private MatriculaService $service;

    public function __construct()
    {
        $this->service = new MatriculaService();
    }

    /**
     * Processa a matrícula completa do aluno.
     *
     * @param string $nome
     * @param int    $idade
     * @param string $curso
     */
    public function processarMatricula(string $nome, int $idade, string $curso): void
    {
        try {
            // 1. Chama o Service para aplicar as regras de negócio
            $dadosProcessados = $this->service->validarMatricula($nome, $idade, $curso);

            // 2. Instancia o Model e define os dados via Setters
            $aluno = new AlunoModel();
            $aluno->setNome($dadosProcessados['nome']);
            $aluno->setIdade($dadosProcessados['idade']);
            $aluno->setCurso($dadosProcessados['curso']);

            // 3. Salva no banco de dados SQLite
            $aluno->save();

            // 4. Monta a mensagem de sucesso
            $mensagem = "✅ Matrícula realizada com sucesso!<br>"
                      . "<strong>Nome:</strong> {$dadosProcessados['nome']}<br>"
                      . "<strong>Idade:</strong> {$dadosProcessados['idade']} anos<br>"
                      . "<strong>Curso:</strong> {$dadosProcessados['curso']}";

            if ($dadosProcessados['bolsa']) {
                $mensagem .= "<br><br>🎓 <strong>Parabéns!</strong> Você recebeu uma bolsa de "
                           . "{$dadosProcessados['percentual_bolsa']}% de desconto!";
            }

            // Exibe a view com mensagem de sucesso
            $tipo = 'sucesso';
            require __DIR__ . '/view.php';

        } catch (Exception $e) {
            // Exibe a view com mensagem de erro
            $mensagem = "❌ Erro na matrícula: " . $e->getMessage();
            $tipo = 'erro';
            require __DIR__ . '/view.php';
        }
    }
}
