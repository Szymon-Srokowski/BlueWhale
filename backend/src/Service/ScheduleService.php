<?php

namespace App\Service;

use PDO;

class ScheduleService
{
    private PDO $pdo;

    public function __construct(PDO $pdo)
    {
        $this->pdo = $pdo;
    }

    public function fetchAndSaveFromApi(): void
    {
        $apiUrl = 'https://example.com/api/schedule';
        $data = $this->fetchApiData($apiUrl);

        foreach ($data as $item) {
            $workerId = $this->saveWorker($item['worker']);
            $roomId = $this->saveRoom($item['room']);
            $groupId = $this->saveGroup($item['group_name']);
            $subjectId = $this->saveSubject($item['subject']);

            $this->saveSchedule(
                $item['title'],
                $item['start'],
                $item['end'],
                $workerId,
                $roomId,
                $groupId,
                $subjectId,
                $item['lesson_form'] ?? null
            );
        }
    }

    private function fetchApiData(string $url): array
    {
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $response = curl_exec($ch);
        curl_close($ch);

        return json_decode($response, true);
    }

    private function saveWorker(string $name): int
    {
        $stmt = $this->pdo->prepare("SELECT id FROM workers WHERE name = :name");
        $stmt->execute([':name' => $name]);
        $worker = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$worker) {
            $stmt = $this->pdo->prepare("INSERT INTO workers (name) VALUES (:name)");
            $stmt->execute([':name' => $name]);
            return (int)$this->pdo->lastInsertId();
        }

        return (int)$worker['id'];
    }

    private function saveRoom(string $name): int
    {
        $stmt = $this->pdo->prepare("SELECT id FROM rooms WHERE name = :name");
        $stmt->execute([':name' => $name]);
        $room = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$room) {
            $stmt = $this->pdo->prepare("INSERT INTO rooms (name) VALUES (:name)");
            $stmt->execute([':name' => $name]);
            return (int)$this->pdo->lastInsertId();
        }

        return (int)$room['id'];
    }

    private function saveGroup(string $name): int
    {
        $stmt = $this->pdo->prepare("SELECT id FROM study_groups WHERE name = :name");
        $stmt->execute([':name' => $name]);
        $group = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$group) {
            $stmt = $this->pdo->prepare("INSERT INTO study_groups (name) VALUES (:name)");
            $stmt->execute([':name' => $name]);
            return (int)$this->pdo->lastInsertId();
        }

        return (int)$group['id'];
    }

    private function saveSubject(string $title): int
    {
        $stmt = $this->pdo->prepare("SELECT id FROM subjects WHERE title = :title");
        $stmt->execute([':title' => $title]);
        $subject = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$subject) {
            $stmt = $this->pdo->prepare("INSERT INTO subjects (title) VALUES (:title)");
            $stmt->execute([':title' => $title]);
            return (int)$this->pdo->lastInsertId();
        }

        return (int)$subject['id'];
    }

    private function saveSchedule(
        string $title,
        string $startTime,
        string $endTime,
        int $workerId,
        int $roomId,
        int $groupId,
        int $subjectId,
        ?string $lessonForm
    ): void
    {
        $stmt = $this->pdo->prepare("SELECT id FROM schedules WHERE title = :title AND startTime = :start AND endTime = :end");
        $stmt->execute([
            ':title' => $title,
            ':start' => $startTime,
            ':end' => $endTime
        ]);

        if (!$stmt->fetch(PDO::FETCH_ASSOC)) {
            $insertStmt = $this->pdo->prepare("
                INSERT INTO schedules (title, startTime, endTime, worker_id, room_id, group_id, subject_id, lessonForm)
                VALUES (:title, :startTime, :endTime, :workerId, :roomId, :groupId, :subjectId, :lessonForm)
            ");
            $insertStmt->execute([
                ':title' => $title,
                ':startTime' => $startTime,
                ':endTime' => $endTime,
                ':workerId' => $workerId,
                ':roomId' => $roomId,
                ':groupId' => $groupId,
                ':subjectId' => $subjectId,
                ':lessonForm' => $lessonForm,
            ]);
        }
    }
}
