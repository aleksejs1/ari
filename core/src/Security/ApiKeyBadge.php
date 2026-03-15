<?php

namespace Ari\Security;

use Ari\Entity\ApiKey;
use Symfony\Component\Security\Http\Authenticator\Passport\Badge\BadgeInterface;

final class ApiKeyBadge implements BadgeInterface
{
    private ?ApiKey $apiKey = null;

    public function __construct(
        private readonly string $rawToken,
    ) {
    }

    public function getRawToken(): string
    {
        return $this->rawToken;
    }

    /**
     * Attach the resolved ApiKey entity so that createToken() can retrieve it
     * without performing a second hash computation and database lookup.
     */
    public function setApiKey(ApiKey $apiKey): void
    {
        $this->apiKey = $apiKey;
    }

    public function getApiKey(): ?ApiKey
    {
        return $this->apiKey;
    }

    #[\Override]
    public function isResolved(): bool
    {
        return true;
    }
}
