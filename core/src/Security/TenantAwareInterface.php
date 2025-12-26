<?php

namespace App\Security;

use App\Entity\User;

interface TenantAwareInterface
{
    public function getTenant(): ?User;
}
