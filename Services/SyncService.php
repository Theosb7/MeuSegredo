<?php
require_once __DIR__ . '/../Model/UserData.php';

class SyncService {
    public static function saveKey($userId, $key, $value) {
        return UserData::saveKey($userId, $key, $value);
    }

    public static function getAll($userId) {
        return UserData::getAll($userId);
    }

    public static function getByKey($userId, $key) {
        return UserData::getByKey($userId, $key);
    }
}
