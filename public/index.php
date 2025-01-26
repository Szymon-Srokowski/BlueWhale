<?php

require_once __DIR__ . '/../backend/src/Controller/ApiController.php';
require_once __DIR__ . '/../backend/src/Utils/Database.php';
require_once __DIR__ . '/../vendor/autoload.php';

use App\Controller\ApiController;
use App\Service\ScheduleService;
use App\Utils\Database;

$dbConfig = [
    'host' => '127.0.0.1',
    'port' => 5432,
    'dbname' => 'postgres',
    'user' => 'postgres',
    'password' => 'PROPER4321Qw',
];

header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}
try {
    $pdo = Database::getConnection($dbConfig);

    $scheduleService = new ScheduleService($pdo);
    $apiController = new ApiController($scheduleService);

    $uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

    switch ($uri) {
        case '/fetch-rooms':
            $apiController->fetchRoomsData();
            break;

        case '/fetch-workers':
            $apiController->fetchWorkersData();
            break;

        case '/fetch-groups':
            $apiController->fetchGroupData();
            break;

        case '/fetch-subjects':
            $apiController->fetchSubjectData();
            break;
        case '/fetch-students':
            $start = $_GET['start'] ?? 1;
            $end = $_GET['end'] ?? 1000;
            $apiController->fetchStudentsData((int)$start, (int)$end);
            break;

        case '/fetch-student-schedule-range':
            $apiController->fetchStudentScheduleInRange();
            break;

        case '/fetch-student-schedule':
            $studentIndex = $_GET['index'] ?? null;
            if (!$studentIndex) {
                http_response_code(400);
                echo json_encode(['error' => 'Student index is required']);
            } else {
                $apiController->fetchStudentSchedule((int)$studentIndex);
            }
            break;

        case '/fetch-all-data':
            $apiController->fetchAndSaveAllData();
            break;

        default:
            http_response_code(404);
            echo json_encode(['error' => 'Not Found']);
            break;
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Internal Server Error',
        'error' => $e->getMessage(),
    ]);
}