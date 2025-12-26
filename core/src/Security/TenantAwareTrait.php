<?php

namespace App\Security;

use App\Entity\User;
use Doctrine\ORM\Mapping as ORM;

trait TenantAwareTrait
{
    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $tenant = null;

    public function getTenant(): ?User
    {
        return $this->tenant;
    }

    public function setTenant(?User $tenant): static
    {
        $this->tenant = $tenant;

        return $this;
    }
}
