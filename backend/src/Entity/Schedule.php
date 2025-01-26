<?php

namespace App\Entity;

class Schedule
{
    private ?int $id = null;
    private ?string $title = null;
    private ?string $description = null;
    private ?\DateTimeInterface $startTime = null;
    private ?\DateTimeInterface $endTime = null;
    private ?int $workerId = null;
    private ?int $roomId = null;
    private ?int $groupId = null;
    private ?int $subjectId = null;
    private ?int $userId = null;
    private ?string $lessonForm = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): self
    {
        $this->title = $title;
        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): self
    {
        $this->description = $description;
        return $this;
    }

    public function getStartTime(): ?\DateTimeInterface
    {
        return $this->startTime;
    }

    public function setStartTime(?\DateTimeInterface $startTime): self
    {
        $this->startTime = $startTime;
        return $this;
    }

    public function getEndTime(): ?\DateTimeInterface
    {
        return $this->endTime;
    }

    public function setEndTime(?\DateTimeInterface $endTime): self
    {
        $this->endTime = $endTime;
        return $this;
    }

    public function getWorkerId(): ?int
    {
        return $this->workerId;
    }

    public function setWorkerId(?int $workerId): self
    {
        $this->workerId = $workerId;
        return $this;
    }

    public function getRoomId(): ?int
    {
        return $this->roomId;
    }

    public function setRoomId(?int $roomId): self
    {
        $this->roomId = $roomId;
        return $this;
    }

    public function getGroupId(): ?int
    {
        return $this->groupId;
    }

    public function setGroupId(?int $groupId): self
    {
        $this->groupId = $groupId;
        return $this;
    }

    public function getSubjectId(): ?int
    {
        return $this->subjectId;
    }

    public function setSubjectId(?int $subjectId): self
    {
        $this->subjectId = $subjectId;
        return $this;
    }

    public function getUserId(): ?int
    {
        return $this->userId;
    }

    public function setUserId(?int $userId): self
    {
        $this->userId = $userId;
        return $this;
    }

    public function getLessonForm(): ?string
    {
        return $this->lessonForm;
    }

    public function setLessonForm(?string $lessonForm): self
    {
        $this->lessonForm = $lessonForm;
        return $this;
    }
}
