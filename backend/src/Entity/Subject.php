<?php

namespace App\Entity;

class Subject
{
    private ?int $id;
    private string $name;
    private ?Worker $worker;

    public function __construct(?int $id, string $name, ?Worker $worker = null)
    {
        $this->id = $id;
        $this->name = $name;
        $this->worker = $worker;
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

    public function getName(): string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;
        return $this;
    }

    public function getWorker(): ?Worker
    {
        return $this->worker;
    }

    public function setWorker(?Worker $worker): self
    {
        $this->worker = $worker;
        return $this;
    }

}
