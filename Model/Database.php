<?php

class Database {
    private static $pdo = null;

    public static function getConnection() {
        if (self::$pdo === null) {
            $dbPath = __DIR__ . '/../data/banco.sqlite';
            $dbDir = dirname($dbPath);
            if (!is_dir($dbDir)) {
                mkdir($dbDir, 0777, true);
            }

            try {
                self::$pdo = new PDO('sqlite:' . $dbPath);
                self::$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                self::$pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

                self::initTables();
            } catch (Exception $e) {
                $msg = $e->getMessage();
                if (stripos($msg, 'could not find driver') !== false || !extension_loaded('pdo_sqlite')) {
                    $hint = 'Driver PDO SQLite não encontrado. Habilite a extensão pdo_sqlite (ex: on Debian/Ubuntu run "sudo apt install php-sqlite3"), então reinicie o servidor PHP.';
                    die(json_encode(['status' => 'error', 'message' => 'Erro no banco: could not find driver', 'hint' => $hint]));
                }
                die(json_encode(['status' => 'error', 'message' => 'Erro no banco: ' . $msg]));
            }
        }
        return self::$pdo;
    }

    private static function initTables() {
        self::$pdo->exec("CREATE TABLE IF NOT EXISTS usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            senha TEXT NOT NULL,
            criado_em TEXT NOT NULL
        )");

        self::$pdo->exec("CREATE TABLE IF NOT EXISTS usuario_dados (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            usuario_id INTEGER NOT NULL,
            chave TEXT NOT NULL,
            valor TEXT NOT NULL,
            UNIQUE(usuario_id, chave),
            FOREIGN KEY(usuario_id) REFERENCES usuarios(id)
        )");
    }
}
