<?php

/**
 * Migration - Preparando o Terreno
 * 
 * Responsável por criar o banco de dados SQLite e a tabela de alunos.
 * Execute este arquivo UMA ÚNICA VEZ antes de testar a aplicação:
 *   php migration.php
 */

class Migration
{
    private PDO $pdo;

    public function __construct()
    {
        // Cria (ou abre) o arquivo database.sqlite na mesma pasta
        $this->pdo = new PDO('sqlite:' . __DIR__ . '/database.sqlite');

        // Configura o PDO para lançar exceções em caso de erro
        $this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    }

    /**
     * Executa o comando SQL de criação da tabela de alunos.
     */
    public function executar(): void
    {
        $sql = "CREATE TABLE IF NOT EXISTS alunos (
            id    INTEGER PRIMARY KEY AUTOINCREMENT,
            nome  TEXT,
            idade INTEGER,
            curso TEXT
        )";

        $this->pdo->exec($sql);

        echo "✅ Migration executada com sucesso!\n";
        echo "   Banco de dados: database.sqlite\n";
        echo "   Tabela 'alunos' criada (ou já existia).\n";
    }
}

// Executa a migration
$migration = new Migration();
$migration->executar();
