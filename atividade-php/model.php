<?php

/**
 * Model - AlunoModel
 * 
 * Único local do sistema que se comunica com a tabela de alunos.
 * Usa propriedades privadas com Getters/Setters (POO) e Prepared Statements.
 */

class AlunoModel
{
    // Propriedades privadas
    private string $nome;
    private int    $idade;
    private string $curso;

    // ========================
    //        GETTERS
    // ========================

    public function getNome(): string
    {
        return $this->nome;
    }

    public function getIdade(): int
    {
        return $this->idade;
    }

    public function getCurso(): string
    {
        return $this->curso;
    }

    // ========================
    //        SETTERS
    // ========================

    public function setNome(string $nome): void
    {
        $this->nome = $nome;
    }

    public function setIdade(int $idade): void
    {
        $this->idade = $idade;
    }

    public function setCurso(string $curso): void
    {
        $this->curso = $curso;
    }

    // ========================
    //     PERSISTÊNCIA
    // ========================

    /**
     * Salva os dados do objeto na tabela 'alunos' usando Prepared Statements.
     */
    public function save(): void
    {
        // Instancia uma conexão PDO com o arquivo database.sqlite
        $pdo = new PDO('sqlite:' . __DIR__ . '/database.sqlite');
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // INSERT com Prepared Statements para evitar SQL Injection
        $stmt = $pdo->prepare("INSERT INTO alunos (nome, idade, curso) VALUES (:nome, :idade, :curso)");

        $stmt->bindValue(':nome',  $this->nome,  PDO::PARAM_STR);
        $stmt->bindValue(':idade', $this->idade,  PDO::PARAM_INT);
        $stmt->bindValue(':curso', $this->curso,  PDO::PARAM_STR);

        $stmt->execute();
    }
}
