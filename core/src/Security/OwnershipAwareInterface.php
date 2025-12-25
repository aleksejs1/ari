<?php

namespace App\Security;

use App\Entity\User;

interface OwnershipAwareInterface
{
    public function getOwner(): ?User;
}
