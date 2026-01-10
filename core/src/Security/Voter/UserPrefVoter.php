<?php

namespace App\Security\Voter;

use App\Entity\User;
use App\Entity\UserPref;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;

/**
 * @extends Voter<string, UserPref>
 */
class UserPrefVoter extends Voter
{
    public const VIEW = 'USER_PREF_VIEW';
    public const EDIT = 'USER_PREF_EDIT';

    #[\Override]
    protected function supports(string $attribute, mixed $subject): bool
    {
        return in_array($attribute, [self::VIEW, self::EDIT], true)
            && $subject instanceof UserPref;
    }

    #[\Override]
    protected function voteOnAttribute(string $attribute, mixed $subject, TokenInterface $token): bool
    {
        $user = $token->getUser();
        if (!$user instanceof User) {
            return false;
        }

        $userPref = $subject;

        return match ($attribute) {
            self::VIEW => $this->canView($userPref, $user),
            self::EDIT => $this->canEdit($userPref, $user),
            default => false,
        };
    }

    private function canView(UserPref $userPref, User $user): bool
    {
        return $userPref->getUser() === $user;
    }

    private function canEdit(UserPref $userPref, User $user): bool
    {
        return $userPref->getUser() === $user;
    }
}
