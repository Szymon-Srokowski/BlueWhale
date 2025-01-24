<?php

require_once __DIR__ . '/bootstrap.php';
require_once __DIR__ . '/src/Controller/ApiController.php';

use App\Controller\ApiController;
use App\Service\ScheduleService;

$dsn = 'mysql:host=127.0.0.1;dbname=bluewhale_project;charset=utf8mb4';
$username = 'micha';
$password = '';
$pdo = new PDO($dsn, $username, $password);
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

// Создание объектов
$scheduleService = new ScheduleService($pdo);
$apiController = new ApiController($scheduleService);

// Обработка маршрутов
$uri = $_SERVER['REQUEST_URI'];

if ($uri === '/fetch-data') {
    $apiController->fetchAndSaveData();
} elseif ($uri === '/get-schedules') {
    $apiController->getSchedules();
} else {
    http_response_code(404);
    echo json_encode(['status' => 'error', 'message' => 'Route not found']);
}
