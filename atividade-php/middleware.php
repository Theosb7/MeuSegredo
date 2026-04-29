<?php

/**
 * Middleware - Segurança e Validação
 * 
 * Atua antes do Router entregar os dados ao Controller.
 * Verifica se todos os campos foram preenchidos e se a idade é um número.
 */

class Middleware
{
    /**
     * Valida os dados recebidos via POST.
     *
     * @param  array $dados  Dados do formulário ($_POST)
     * @return array         Dados validados e sanitizados
     * @throws Exception     Se a validação falhar
     */
    public static function validar(array $dados): array
    {
        // Verifica se todos os campos obrigatórios foram preenchidos
        if (empty($dados['nome']) || !isset($dados['idade']) || $dados['idade'] === '' || empty($dados['curso'])) {
            throw new Exception("⚠️ Todos os campos são obrigatórios. Preencha Nome, Idade e Curso.");
        }

        // Verifica se o nome não é apenas espaços em branco
        $nome = trim($dados['nome']);
        if ($nome === '') {
            throw new Exception("⚠️ O campo Nome não pode estar vazio.");
        }

        // Verifica se a idade é realmente um número
        if (!is_numeric($dados['idade'])) {
            throw new Exception("⚠️ O campo Idade deve ser um número válido.");
        }

        $idade = (int) $dados['idade'];

        // Verifica se a idade está num intervalo razoável
        if ($idade < 1 || $idade > 120) {
            throw new Exception("⚠️ A idade deve estar entre 1 e 120 anos.");
        }

        $curso = trim($dados['curso']);
        if ($curso === '') {
            throw new Exception("⚠️ Selecione um curso válido.");
        }

        // Retorna os dados validados e sanitizados
        return [
            'nome'  => htmlspecialchars($nome, ENT_QUOTES, 'UTF-8'),
            'idade' => $idade,
            'curso' => htmlspecialchars($curso, ENT_QUOTES, 'UTF-8'),
        ];
    }
}
