<?php

namespace App\Security\Voter;

use App\Security\OwnershipAwareInterface;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;
use Symfony\Component\Security\Core\User\UserInterface;

/**
 * @extends Voter<string, OwnershipAwareInterface>
 */
final class ContactVoter extends Voter
{
    public const EDIT = 'CONTACT_EDIT';
    public const VIEW = 'CONTACT_VIEW';
    public const ADD = 'CONTACT_ADD';

    #[\Override]
    protected function supports(string $attribute, mixed $subject): bool
    {
        return in_array($attribute, [self::EDIT, self::VIEW, self::ADD], true)
            && $subject instanceof OwnershipAwareInterface;
    }

    #[\Override]
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

            case self::ADD:
                return true;
        }

        return false;
    }
}
