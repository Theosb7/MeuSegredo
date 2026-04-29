<?php

/**
 * Service - MatriculaService
 * 
 * Resolve regras de negócio. Não lida com HTTP nem SQL.
 * Verifica idade mínima por curso e aplica lógica de bolsa de estudos.
 */

class MatriculaService
{
    /**
     * Idade mínima exigida para cada curso.
     */
    private array $idadeMinimaPermitida = [
        'Engenharia'       => 17,
        'Medicina'         => 18,
        'Direito'          => 17,
        'Administração'    => 16,
        'Ciência da Computação' => 16,
    ];

    /**
     * Valida as regras de negócio do aluno.
     *
     * @param  string $nome
     * @param  int    $idade
     * @param  string $curso
     * @return array  Dados processados (com informação de bolsa, se aplicável)
     * @throws Exception Se alguma regra falhar
     */
    public function validarMatricula(string $nome, int $idade, string $curso): array
    {
        // --- Regra 1: Verificar se o curso existe na lista ---
        if (!array_key_exists($curso, $this->idadeMinimaPermitida)) {
            throw new Exception("O curso '{$curso}' não está disponível para matrícula.");
        }

        // --- Regra 2: Verificar idade mínima do curso ---
        $idadeMinima = $this->idadeMinimaPermitida[$curso];

        if ($idade < $idadeMinima) {
            throw new Exception(
                "Idade insuficiente para o curso de {$curso}. "
                . "Idade mínima: {$idadeMinima} anos. Sua idade: {$idade} anos."
            );
        }

        // --- Regra 3: Lógica de bolsa de estudos ---
        $bolsa = false;
        $percentualBolsa = 0;

        // Alunos com 16 ou 17 anos ganham bolsa de incentivo jovem (20%)
        if ($idade >= 16 && $idade <= 17) {
            $bolsa = true;
            $percentualBolsa = 20;
        }

        // Alunos com 60 anos ou mais ganham bolsa sênior (30%)
        if ($idade >= 60) {
            $bolsa = true;
            $percentualBolsa = 30;
        }

        // Retorna os dados processados
        return [
            'nome'             => $nome,
            'idade'            => $idade,
            'curso'            => $curso,
            'bolsa'            => $bolsa,
            'percentual_bolsa' => $percentualBolsa,
        ];
    }
}
