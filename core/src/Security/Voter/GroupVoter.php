<?php

namespace Ari\Security\Voter;

use Ari\Security\TenantAwareInterface;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;
use Symfony\Component\Security\Core\User\UserInterface;

/**
 * @extends Voter<string, TenantAwareInterface>
 */
final class GroupVoter extends Voter
{
    public const EDIT = 'GROUP_EDIT';
    public const VIEW = 'GROUP_VIEW';
    public const ADD = 'GROUP_ADD';
    public const DELETE = 'GROUP_DELETE';

    #[\Override]
    protected function supports(string $attribute, mixed $subject): bool
    {
        return in_array($attribute, [self::EDIT, self::VIEW, self::ADD, self::DELETE], true)
            && $subject instanceof TenantAwareInterface;
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
            case self::DELETE:
                if ($subject->getTenant() === $user) {
                    return true;
                }
                break;

            case self::VIEW:
                if ($subject->getTenant() === $user) {
                    return true;
                }
                break;

            case self::ADD:
                return true;
        }

        return false;
    }
}
