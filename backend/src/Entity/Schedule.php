<?php

namespace App\Entity;

class Schedule
{
private int $id;
private string $title;
private ?string $description;
private \DateTime $startTime;
private \DateTime $endTime;
private ?Worker $worker;
private ?Room $room;
private ?StudyGroup $studyGroup;
private ?Subject $subject;
private ?string $lessonForm;

// Getters and Setters
public function getId(): int
{
return $this->id;
}

public function getTitle(): string
{
return $this->title;
}

public function setTitle(string $title): void
{
$this->title = $title;
}

public function getDescription(): ?string
{
return $this->description;
}

public function setDescription(?string $description): void
{
$this->description = $description;
}

public function getStartTime(): \DateTime
{
return $this->startTime;
}

public function setStartTime(\DateTime $startTime): void
{
$this->startTime = $startTime;
}

public function getEndTime(): \DateTime
{
return $this->endTime;
}

public function setEndTime(\DateTime $endTime): void
{
$this->endTime = $endTime;
}

public function getWorker(): ?Worker
{
return $this->worker;
}

public function setWorker(?Worker $worker): void
{
$this->worker = $worker;
}

public function getRoom(): ?Room
{
return $this->room;
}

public function setRoom(?Room $room): void
{
$this->room = $room;
}

public function getStudyGroup(): ?StudyGroup
{
return $this->studyGroup;
}

public function setStudyGroup(?StudyGroup $studyGroup): void
{
$this->studyGroup = $studyGroup;
}

public function getSubject(): ?Subject
{
return $this->subject;
}

public function setSubject(?Subject $subject): void
{
$this->subject = $subject;
}

public function getLessonForm(): ?string
{
return $this->lessonForm;
}

public function setLessonForm(?string $lessonForm): void
{
$this->lessonForm = $lessonForm;
}
}
