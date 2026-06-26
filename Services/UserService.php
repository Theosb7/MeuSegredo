<?php
require_once __DIR__ . '/../Model/Database.php';
require_once __DIR__ . '/../Model/User.php';
require_once __DIR__ . '/../Model/UserData.php';

class UserService {
    public static function deleteAccount($userId) {
        $pdo = Database::getConnection();
        try {
            $pdo->beginTransaction();
            UserData::deleteAll($userId);
            User::delete($userId);
            $pdo->commit();
            return true;
        } catch (Exception $e) {
            if ($pdo->inTransaction()) {
                $pdo->rollBack();
            }
            throw $e;
        }
    }
}
