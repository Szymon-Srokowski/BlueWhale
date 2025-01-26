<?php

namespace App\Controller;

use App\Service\ScheduleService;

class ApiController
{
    private ScheduleService $scheduleService;

    public function __construct(ScheduleService $scheduleService)
    {
        $this->scheduleService = $scheduleService;
    }

    public function fetchAndSaveAllData(): void
    {
        try {
            $this->scheduleService->fetchAndSaveRooms();
            $this->scheduleService->fetchAndSaveWorkers();
            $this->scheduleService->fetchAndSaveGroups();
            $this->scheduleService->fetchAndSaveSubjects();
            $this->scheduleService->fetchAndSaveStudents();
            $this->scheduleService->fetchAndSaveAllSchedules();

            echo json_encode(['status' => 'success', 'message' => 'All data fetched and saved successfully.']);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
        }
    }

    public function fetchStudentSchedule(string $studentIndex): void
    {
        try {
            $scheduleData = $this->scheduleService->fetchStudentScheduleData((int)$studentIndex);

            if (empty($scheduleData)) {
                $this->scheduleService->fetchAndSaveStudentSchedule((int)$studentIndex);
                $scheduleData = $this->scheduleService->fetchStudentScheduleData((int)$studentIndex);
            }

            echo json_encode(['status' => 'success', 'message' => 'Student schedule fetched successfully.', 'data' => $scheduleData]);
        } catch (\Exception $e) {
            http_response_code(500);
            error_log("Error fetching and saving schedule for student {$studentIndex}: " . $e->getMessage());
            echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
        }
    }

    public function fetchStudentScheduleInRange(): void
    {
        $studentIndex = $_GET['index'] ?? null;
        $startDate = $_GET['startDate'] ?? null;
        $endDate = $_GET['endDate'] ?? null;

        if (!$studentIndex || !$startDate || !$endDate) {
            http_response_code(400);
            echo json_encode([
                'status' => 'error',
                'message' => 'Missing required parameters: index, startDate, endDate',
            ]);
            return;
        }

        $maxRequests = 30;
        $timeWindow = 20;
        $this->rateLimit($studentIndex, $maxRequests, $timeWindow);
        try {
            $scheduleData = $this->scheduleService->fetchStudentScheduleInRange(
                (int)$studentIndex,
                $startDate,
                $endDate
            );

            if (empty($scheduleData)) {
                $this->scheduleService->fetchAndSaveStudentSchedule((int)$studentIndex);
                $scheduleData = $this->scheduleService->fetchStudentScheduleInRange(
                    (int)$studentIndex,
                    $startDate,
                    $endDate
                );
            }
            echo json_encode([
                'status' => 'success',
                'data' => $scheduleData,
            ]);
        } catch (\Exception $e) {
            http_response_code(500);
            error_log("Error fetching student schedule in range for student {$studentIndex}: " . $e->getMessage());
            echo json_encode([
                'status' => 'error',
                'message' => 'Internal server error. Please try again later.',
            ]);
        }
    }

    private function rateLimit(string $studentIndex, int $maxRequests, int $timeWindow): bool
    {
        $file = sys_get_temp_dir() . "/rate_limit_{$studentIndex}.json";

        if (file_exists($file)) {
            $data = json_decode(file_get_contents($file), true);
        } else {
            $data = ['requests' => 0, 'start_time' => time()];
        }

        $currentTime = time();
        if ($currentTime - $data['start_time'] > $timeWindow) {
            $data['requests'] = 0;
            $data['start_time'] = $currentTime;
        }

        $data['requests']++;

        file_put_contents($file, json_encode($data));
        if ($data['requests'] > $maxRequests) {
            $remainingTime = $timeWindow - ($currentTime - $data['start_time']);
            http_response_code(429);
            echo json_encode([
                'status' => 'error',
                'message' => "Too many requests. Please wait {$remainingTime} seconds.",
                'retry_after' => $remainingTime
            ]);
            exit;
        }
        return true;
    }

    public function fetchRoomsData(): void
    {
        try {
            $this->scheduleService->fetchAndSaveRooms();
            echo json_encode(['status' => 'success', 'message' => 'Rooms data saved successfully.']);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
        }
    }

    public function fetchWorkersData(): void
    {
        try {
            $this->scheduleService->fetchAndSaveWorkers();
            echo json_encode(['status' => 'success', 'message' => 'Workers data saved successfully.']);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
        }
    }

    public function fetchGroupData(): void
    {
        try {
            $this->scheduleService->fetchAndSaveGroups();
            echo json_encode(['status' => 'success', 'message' => 'Group data saved successfully.']);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
        }
    }

    public function fetchSubjectData(): void
    {
        try {
            $this->scheduleService->fetchAndSaveSubjects();
            echo json_encode(['status' => 'success', 'message' => 'Subject data saved successfully.']);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
        }
    }

    public function fetchStudentsData(): void
    {
        try {
            $this->scheduleService->fetchAndSaveStudents();
            echo json_encode(['status' => 'success', 'message' => 'Students data saved successfully.']);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
        }
    }
}
