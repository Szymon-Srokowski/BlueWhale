<?php

namespace App\Service;

use PDO;
use Exception;

class ScheduleService
{
    private PDO $pdo;

    public function __construct(PDO $pdo)
    {
        $this->pdo = $pdo;
    }

    private function fetchApiData(string $url): string
    {
        $context = stream_context_create([
            "http" => [
                "timeout" => 10,
            ],
        ]);

        $response = @file_get_contents($url, false, $context);

        if ($response === false) {
            throw new \Exception("Failed to fetch data from URL: $url");
        }

        return $response;
    }

    private function saveSchedule(array $lesson, int $studentIndex): void
    {
        try{
            error_log("saveSchedule started for student_index: ". $studentIndex . " title: ". $lesson['title']);
            $stmt = $this->pdo->prepare("
            INSERT INTO schedule (
                student_index,
                title,
                description,
                start_time,
                end_time,
                worker_title,
                worker,
                worker_cover,
                lesson_form,
                lesson_form_short,
                group_name,
                tok_name,
                room,
                lesson_status,
                lesson_status_short,
                status_item,
                subject,
                hours,
                color,
                borderColor
            ) VALUES (
                :student_index,
                :title,
                :description,
                :start_time,
                :end_time,
                :worker_title,
                :worker,
                :worker_cover,
                :lesson_form,
                :lesson_form_short,
                :group_name,
                :tok_name,
                :room,
                :lesson_status,
                :lesson_status_short,
                :status_item,
                :subject,
                :hours,
                :color,
                :borderColor
            ) ON CONFLICT (student_index, title, start_time, end_time) DO UPDATE SET
                description = :description,
                worker_title = :worker_title,
                worker = :worker,
                worker_cover = :worker_cover,
                lesson_form = :lesson_form,
                lesson_form_short = :lesson_form_short,
                group_name = :group_name,
                tok_name = :tok_name,
                room = :room,
                lesson_status = :lesson_status,
                lesson_status_short = :lesson_status_short,
                status_item = :status_item,
                subject = :subject,
                hours = :hours,
                color = :color,
                borderColor = :borderColor
           ");


            $stmt->execute([
                ':student_index' => $studentIndex,
                ':title' => $lesson['title'],
                ':description' => $lesson['description'] ?? null,
                ':start_time' => $lesson['start'],
                ':end_time' => $lesson['end'],
                ':worker_title' => $lesson['worker_title'],
                ':worker' => $lesson['worker'],
                ':worker_cover' => $lesson['worker_cover'],
                ':lesson_form' => $lesson['lesson_form']?? null,
                ':lesson_form_short' => $lesson['lesson_form_short'],
                ':group_name' => $lesson['group_name'],
                ':tok_name' => $lesson['tok_name'],
                ':room' => $lesson['room'],
                ':lesson_status' => $lesson['lesson_status'],
                ':lesson_status_short' => $lesson['lesson_status_short'],
                ':status_item' => $lesson['status_item'],
                ':subject' => $lesson['subject'],
                ':hours' => $lesson['hours'],
                ':color' => $lesson['color'],
                ':borderColor' => $lesson['borderColor'],
            ]);
            error_log("saveSchedule finished for student_index: ". $studentIndex . " title: ". $lesson['title']);

        } catch(\PDOException $e){
            error_log("Failed to save schedule : " . $e->getMessage()."\n"."SQL: ".$stmt->queryString );
        }
    }

    public function fetchAndSaveStudentSchedule(int $studentIndex): void
    {
        $url = "https://plan.zut.edu.pl/schedule_student.php?number={$studentIndex}&start=2024-10-01T00:00:00+01:00&end=2025-11-01T00:00:00+01:00";
        try {
            error_log("fetchAndSaveStudentSchedule started for: " . $studentIndex);
            $data = $this->fetchApiDataWithRetry($url);

            if ($data !== null && is_array($data)) {
                error_log("Data fetched for student: " . $studentIndex."  count :". count($data));
                foreach ($data as $lesson) {
                    $this->saveSchedule($lesson, $studentIndex);
                }
            }else{
                error_log("No data returned from API or data is not an array");
            }
            error_log("fetchAndSaveStudentSchedule finished for: " . $studentIndex);

        } catch (\Exception $e) {
            error_log("Error saving schedule for student {$studentIndex}: " . $e->getMessage());
        }
    }

    public function fetchStudentScheduleInRange(int $studentIndex, string $startDate, string $endDate): array
    {
        $stmt = $this->pdo->prepare("
            SELECT * FROM schedule 
            WHERE student_index = :student_index 
            AND start_time::date >= :startDate
            AND end_time::date <= :endDate
        ");
        $stmt->execute([
            ':student_index' => $studentIndex,
            ':startDate' => $startDate,
            ':endDate' => $endDate,
        ]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function fetchStudentScheduleData(int $studentIndex): array
    {
        $stmt = $this->pdo->prepare("SELECT * FROM schedule WHERE student_index = :student_index");
        $stmt->execute([':student_index' => $studentIndex]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }


    private function fetchApiDataWithRetry(string $url, int $retries = 3): ?array
    {
        while ($retries > 0) {
            try {
                $response = $this->fetchApiData($url);

                if (is_string($response)) {
                    $data = json_decode($response, true);

                    if (json_last_error() === JSON_ERROR_NONE) {
                        return $data;
                    } else {
                        throw new \Exception("Failed to decode JSON: " . json_last_error_msg());
                    }
                } elseif (is_array($response)) {
                    return $data;
                } else {
                    throw new \Exception("fetchApiData returned incorrect type: " . gettype($response));
                }
            } catch (\Exception $e) {
                $retries--;
                if ($retries === 0) {
                    throw new \Exception("Failed to get data from API after several attempts: " . $e->getMessage());
                }
            }
        }

        return null;
    }
    private function saveEntitiesBatch(string $table, string $column, array $values): void
    {
        if (empty($values)) {
            return;
        }

        $batchSize = 500;

        try {
            $this->pdo->beginTransaction();

            foreach (array_chunk($values, $batchSize) as $batch) {
                $placeholders = implode(',', array_fill(0, count($batch), '(?)'));
                $sql = "INSERT INTO $table ($column) VALUES $placeholders ON CONFLICT ($column) DO NOTHING";

                $stmt = $this->pdo->prepare($sql);

                $flatValues = [];
                foreach ($batch as $value) {
                    $flatValues[] = $value;
                }

                $stmt->execute($flatValues);
            }

            $this->pdo->commit();
        } catch (Exception $e) {
            $this->pdo->rollBack();
            throw $e;
        }
    }

    public function fetchAndSaveRooms(): void
    {
        $url = 'https://plan.zut.edu.pl/schedule.php?kind=room&query=';
        try {
            $data = json_decode($this->fetchApiData($url), true);
        } catch (Exception $e) {
            error_log('Error: ' . $e->getMessage());
            return;
        }

        $rooms = [];
        foreach ($data as $room) {
            if (isset($room['item'])) {
                $rooms[] = trim($room['item']);
            }
        }

        try {
            $this->saveEntitiesBatch('rooms', 'name', $rooms);
        } catch (Exception $e) {
            error_log('Error: ' . $e->getMessage());
        }
    }

    public function fetchAndSaveWorkers(): void
    {
        $url = 'https://plan.zut.edu.pl/schedule.php?kind=teacher&query=';

        $data =  json_decode($this->fetchApiData($url), true);

        $workers = [];
        foreach ($data as $worker) {
            if (isset($worker['item'])) {
                $workers[] = $worker['item'];
            }
        }

        $this->saveEntitiesBatch('workers', 'name', $workers);
    }

    public function fetchAndSaveGroups(): void
    {
        $queries = array_merge(range('A', 'Z'), range('0', '9'), ['-', '_', '']);
        $groups = [];

        foreach ($queries as $query) {
            $url = "https://plan.zut.edu.pl/schedule.php?kind=group&query=" . urlencode($query);

            try {
                $data = json_decode($this->fetchApiData($url), true);

                if (!empty($data)) {
                    foreach ($data as $group) {
                        if (isset($group['item']) && !empty($group['item'])) {
                            $groups[] = trim($group['item']);
                        }
                    }
                }
            } catch (Exception $e) {
                error_log("Error='{$query}': " . $e->getMessage());
            }
        }

        $groups = array_unique($groups);

        try {
            $this->saveEntitiesBatch('groups', 'name', $groups);
            echo "Added. Count: " . count($groups) . "\n";
        } catch (Exception $e) {
            error_log("Error: " . $e->getMessage());
        }
    }
    public function fetchAndSaveSubjects(): void
    {
        set_time_limit(0);
        $queries = array_merge(range('A', 'Z'), range('0', '9'), ['-', '_', '']);
        $batchSize = 5;
        $subjects = [];

        foreach (array_chunk($queries, $batchSize) as $batch) {
            echo "Обработка запроса: " . implode(", ", $batch) . "\n";

            foreach ($batch as $query) {
                $url = "https://plan.zut.edu.pl/schedule.php?kind=subject&query=" . urlencode($query);

                try {
                    $data = json_decode($this->fetchApiData($url), true);

                    if (!empty($data)) {
                        foreach ($data as $subject) {
                            if (!empty($subject['item'])) {
                                $subjects[] = trim($subject['item']);
                            }
                        }
                    }
                } catch (Exception $e) {
                    error_log("Error with='{$query}': " . $e->getMessage());
                }

                usleep(500000);
            }
        }
        $subjects = array_unique($subjects);

        if (!empty($subjects)) {
            try {
                $this->saveEntitiesBatch('subjects', 'title', $subjects);
                echo "Added. Count: " . count($subjects) . "\n";
            } catch (Exception $e) {
                error_log("BD error: " . $e->getMessage());
            }
        } else {
            echo "Not Found.\n";
        }
    }

    public function fetchAndSaveStudents(int $start = 1, int $end = 53000): void
    {
        set_time_limit(0);
        $batchSize = 1000;

        for ($i = $start; $i <= $end; $i += $batchSize) {
            $batchEnd = min($i + $batchSize - 1, $end);
            echo "Error with {$i} по {$batchEnd}\n";

            $students = [];

            for ($j = $i; $j <= $batchEnd; $j++) {
                $url = "https://plan.zut.edu.pl/schedule_student.php?number={$j}&start=2024-10-01T00:00:00+01:00&end=2025-11-01T00:00:00+01:00";
                try {
                    $data = $this->fetchApiDataWithRetry($url);
                    if (!empty($data)) {
                        $students[] = (string)$j;
                    }
                } catch (\Exception $e) {
                    echo "Error {$j}: " . $e->getMessage() . "\n";
                    continue;
                }
            }

            if (!empty($students)) {
                $this->saveEntitiesBatch('users', 'nrAlbumu', $students);
                echo "Added students: " . count($students) . "\n";
            } else {
                echo "Not found {$i}-{$batchEnd}\n";
            }
        }

        echo "End.\n";
    }
}