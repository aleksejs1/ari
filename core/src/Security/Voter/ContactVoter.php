<?php

namespace App\Security\Voter;

use App\Security\OwnershipAwareInterface;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;
use Symfony\Component\Security\Core\User\UserInterface;

final class ContactVoter extends Voter
{
    public const EDIT = 'CONTACT_EDIT';
    public const VIEW = 'CONTACT_VIEW';

    protected function supports(string $attribute, mixed $subject): bool
    {
        return in_array($attribute, [self::EDIT, self::VIEW])
            && $subject instanceof OwnershipAwareInterface;
    }

    protected function voteOnAttribute(string $attribute, mixed $subject, TokenInterface $token): bool
    {
        $user = $token->getUser();

        if (!$user instanceof UserInterface) {
            return false;
        }

        switch ($attribute) {
            case self::EDIT:
                if ($subject->getOwner() === $user) {
                    return true;
                }
                break;

            case self::VIEW:
                if ($subject->getOwner() === $user) {
                    return true;
                }
                break;
        }

        return false;
    }
}
