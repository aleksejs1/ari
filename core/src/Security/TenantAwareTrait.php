<?php

namespace Ari\Security;

use Ari\Entity\User;
use Doctrine\ORM\Mapping as ORM;

trait TenantAwareTrait
{
    #[ORM\ManyToOne(targetEntity: User::class)]
    #[ORM\JoinColumn(nullable: false, onDelete: 'CASCADE')]
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
