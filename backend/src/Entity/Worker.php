<?php

namespace App\Entity;

class Worker
{
    private ?int $id = null;
    private string $firstName;
    private string $lastName;
    private string $position;
    private array $tasks = [];

    public function __construct(string $firstName, string $lastName, string $position)
    {
        $this->firstName = $firstName;
        $this->lastName = $lastName;
        $this->position = $position;
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setId(int $id): self
    {
        $this->id = $id;
        return $this;
    }

    public function getFirstName(): string
    {
        return $this->firstName;
    }

    public function setFirstName(string $firstName): self
    {
        $this->firstName = $firstName;
        return $this;
    }

    public function getLastName(): string
    {
        return $this->lastName;
    }

    public function setLastName(string $lastName): self
    {
        $this->lastName = $lastName;
        return $this;
    }

    public function getPosition(): string
    {
        return $this->position;
    }

    public function setPosition(string $position): self
    {
        $this->position = $position;
        return $this;
    }

    public function getTasks(): array
    {
        return $this->tasks;
    }

    public function addTask(string $task): self
    {
        if (!in_array($task, $this->tasks)) {
            $this->tasks[] = $task;
        }
        return $this;
    }

    public function removeTask(string $task): self
    {
        $this->tasks = array_filter($this->tasks, fn($t) => $t !== $task);
        return $this;
    }
}
