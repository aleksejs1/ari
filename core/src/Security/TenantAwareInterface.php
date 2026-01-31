<?php

namespace Ari\Security;

use Ari\Entity\User;

interface TenantAwareInterface
{
    public function getTenant(): ?User;

    /** @psalm-suppress PossiblyUnusedReturnValue */
    public function setTenant(?User $tenant): static;
}
