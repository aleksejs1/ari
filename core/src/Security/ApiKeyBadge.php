<?php

namespace Ari\Security;

use Symfony\Component\Security\Http\Authenticator\Passport\Badge\BadgeInterface;

final class ApiKeyBadge implements BadgeInterface
{
    public function __construct(
        private readonly string $rawToken,
    ) {
    }

    public function getRawToken(): string
    {
        return $this->rawToken;
    }

    #[\Override]
    public function isResolved(): bool
    {
        return true;
    }
}
