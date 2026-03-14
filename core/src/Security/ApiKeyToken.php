<?php

namespace Ari\Security;

use Symfony\Component\Security\Core\Authentication\Token\AbstractToken;
use Symfony\Component\Security\Core\User\UserInterface;

final class ApiKeyToken extends AbstractToken
{
    /**
     * @param list<string> $scopes
     * @param string[]     $roles
     */
    public function __construct(
        UserInterface $user,
        private readonly string $firewallName,
        private readonly string $apiKeyId,
        private readonly string $apiKeyName,
        private readonly string $apiKeyLastFour,
        private readonly array $scopes,
        array $roles = [],
    ) {
        parent::__construct($roles);
        $this->setUser($user);
    }

    public function getFirewallName(): string
    {
        return $this->firewallName;
    }

    public function getApiKeyId(): string
    {
        return $this->apiKeyId;
    }

    public function getApiKeyName(): string
    {
        return $this->apiKeyName;
    }

    public function getApiKeyLastFour(): string
    {
        return $this->apiKeyLastFour;
    }

    /**
     * @return list<string>
     */
    public function getScopes(): array
    {
        return $this->scopes;
    }

    /**
     * Returns true if the token grants the given scope.
     * Supports wildcards: '*' (all), 'contacts:*' (all contact scopes).
     */
    public function hasScope(string $scope): bool
    {
        foreach ($this->scopes as $granted) {
            if ('*' === $granted) {
                return true;
            }

            if ($granted === $scope) {
                return true;
            }

            if (str_ends_with($granted, ':*')) {
                $resource = substr($granted, 0, -2);
                if (str_starts_with($scope, $resource . ':')) {
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * Returns the audit label for this token.
     */
    public function getActorLabel(): string
    {
        return sprintf(
            'api_key:%s (%s, ...%s)',
            $this->apiKeyId,
            $this->apiKeyName,
            $this->apiKeyLastFour,
        );
    }
}
