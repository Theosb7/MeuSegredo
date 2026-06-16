<?php
require_once __DIR__ . '/Database.php';

class UserData {
    public static function saveKey($userId, $key, $value) {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("INSERT INTO usuario_dados (usuario_id, chave, valor) VALUES (?, ?, ?) 
                               ON CONFLICT(usuario_id, chave) DO UPDATE SET valor = excluded.valor");
        return $stmt->execute([$userId, $key, json_encode($value)]);
    }

    public static function getAll($userId) {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("SELECT chave, valor FROM usuario_dados WHERE usuario_id = ?");
        $stmt->execute([$userId]);
        
        $results = [];
        while ($row = $stmt->fetch()) {
            $results[$row['chave']] = json_decode($row['valor'], true);
        }
        return $results;
    }

    public static function getByKey($userId, $key) {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("SELECT valor FROM usuario_dados WHERE usuario_id = ? AND chave = ?");
        $stmt->execute([$userId, $key]);
        $row = $stmt->fetch();
        
        if ($row) {
            return json_decode($row['valor'], true);
        }
        return null;
    }

    public static function deleteAll($userId) {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("DELETE FROM usuario_dados WHERE usuario_id = ?");
        return $stmt->execute([$userId]);
    }
}
