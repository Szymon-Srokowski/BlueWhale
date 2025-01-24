<?php

namespace App\Controller;

use App\Service\ScheduleService;
use PDO;

class ApiController
{
    private ScheduleService $scheduleService;

    public function __construct(ScheduleService $scheduleService)
    {
        $this->scheduleService = $scheduleService;
    }

    public function fetchAndSaveData(): void
    {
        $apiUrl = 'https://plan.zut.edu.pl/schedule_student.php?number={album_index}&start=2024-10-01T00%3A00%3A00%2B01%3A00&end=2025-11-01T00%3A00%3A00%2B01%3A00';
        $this->scheduleService->fetchAndSaveFromApi($apiUrl);
        echo json_encode(['status' => 'success', 'message' => 'Данные успешно загружены и сохранены.']);
    }
}
