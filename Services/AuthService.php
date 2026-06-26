<?php
require_once __DIR__ . '/../Model/User.php';

class AuthService {
    public static function register(string $nome, string $email, string $senha) {
        $existing = User::findByEmail($email);
        if ($existing) {
            throw new Exception('Email already in use');
        }
        return User::create($nome, $email, $senha);
    }

    public static function authenticate(string $email, string $senha) {
        $user = User::findByEmail($email);
        if ($user && password_verify($senha, $user['senha'])) {
            return $user;
        }
        return null;
    }
}
