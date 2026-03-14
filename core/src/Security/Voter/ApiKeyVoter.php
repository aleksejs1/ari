<?php

namespace Ari\Security\Voter;

use Ari\Entity\ApiKey;
use Ari\Entity\User;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;

/**
 * @extends Voter<string, ApiKey>
 */
final class ApiKeyVoter extends Voter
{
    public const MANAGE = 'API_KEY_MANAGE';

    #[\Override]
    protected function supports(string $attribute, mixed $subject): bool
    {
        return self::MANAGE === $attribute && $subject instanceof ApiKey;
    }

    #[\Override]
    protected function voteOnAttribute(string $attribute, mixed $subject, TokenInterface $token): bool
    {
        $user = $token->getUser();

        if (!$user instanceof User) {
            return false;
        }

        return $subject->getTenant() === $user;
    }
}
