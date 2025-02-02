<?php

namespace App\Utils;

use PDO;
use PDOException;

class Database
{
    public static function getConnection(array $config): PDO
    {
        $dsn = "pgsql:host={$config['host']};port={$config['port']};dbname={$config['dbname']}";

        try {
            $pdo = new PDO($dsn, $config['user'], $config['password']);
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

            return $pdo;
        } catch (PDOException $e) {
            die("Connection failed: " . $e->getMessage());
        }
    }
}

