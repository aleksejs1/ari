<?php

namespace Ari\Security\Voter;

use Ari\Entity\AiSuggestion;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;
use Symfony\Component\Security\Core\User\UserInterface;

/**
 * @extends Voter<string, AiSuggestion>
 */
final class AiSuggestionVoter extends Voter
{
    public const VIEW = 'AI_SUGGESTION_VIEW';
    public const RESOLVE = 'AI_SUGGESTION_RESOLVE';

    #[\Override]
    protected function supports(string $attribute, mixed $subject): bool
    {
        return \in_array($attribute, [self::VIEW, self::RESOLVE], true)
            && $subject instanceof AiSuggestion;
    }

    #[\Override]
    protected function voteOnAttribute(string $attribute, mixed $subject, TokenInterface $token): bool
    {
        $user = $token->getUser();

        if (!$user instanceof UserInterface) {
            return false;
        }

        return $subject->getTenant() === $user;
    }
}
