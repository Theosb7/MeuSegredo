<?php
require_once __DIR__ . '/Database.php';

class User {
    public static function create($nome, $email, $senha) {
        $pdo = Database::getConnection();
        $hash = password_hash($senha, PASSWORD_BCRYPT);
        $stmt = $pdo->prepare("INSERT INTO usuarios (nome, email, senha, criado_em) VALUES (?, ?, ?, ?)");
        $stmt->execute([$nome, $email, $hash, date('Y-m-d H:i:s')]);
        return $pdo->lastInsertId();
    }

    public static function findByEmail($email) {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("SELECT * FROM usuarios WHERE email = ?");
        $stmt->execute([$email]);
        return $stmt->fetch();
    }

    public static function delete($id) {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("DELETE FROM usuarios WHERE id = ?");
        return $stmt->execute([$id]);
    }
}
