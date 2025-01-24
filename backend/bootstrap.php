<?php

use App\Utils\Database;

require_once __DIR__ . '/src/Database.php';

$dbConfig = [
    'host' => '127.0.0.1',
    'dbname' => 'bluewhale_project',
    'user' => 'micha',
    'password' => '',
    'charset' => 'utf8mb4',
];

$pdo = Database::getConnection($dbConfig);
