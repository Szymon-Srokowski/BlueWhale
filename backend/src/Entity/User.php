<?php

namespace App\Entity;

class User
{
    private ?int $id = null;
    private ?int $nrAlbumu = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setId(int $id): self
    {
        $this->id = $id;
        return $this;
    }

    public function getNrAlbumu(): ?int
    {
        return $this->nrAlbumu;
    }

    public function setNrAlbumu(int $nrAlbumu): self
    {
        $this->nrAlbumu = $nrAlbumu;
        return $this;
    }
}
