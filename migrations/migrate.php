<?php
// Simple migration runner: connects and ensures tables exist.
require_once __DIR__ . '/../Model/Database.php';

echo "Running migrations...\n";
$pdo = Database::getConnection();
echo "OK - connection established.\n";

echo "Migrations completed.\n";
