<?php

namespace App\Security\Voter;

use App\Entity\User;
use App\Security\TenantAwareInterface;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;

/**
 * @extends Voter<string, TenantAwareInterface>
 */
final class NotificationVoter extends Voter
{
    public const CHANNEL_VIEW = 'NOTIFICATION_CHANNEL_VIEW';
    public const CHANNEL_EDIT = 'NOTIFICATION_CHANNEL_EDIT';
    public const CHANNEL_ADD = 'NOTIFICATION_CHANNEL_ADD';

    public const SUBSCRIPTION_VIEW = 'NOTIFICATION_SUBSCRIPTION_VIEW';
    public const SUBSCRIPTION_EDIT = 'NOTIFICATION_SUBSCRIPTION_EDIT';
    public const SUBSCRIPTION_ADD = 'NOTIFICATION_SUBSCRIPTION_ADD';

    public const INTENT_VIEW = 'NOTIFICATION_INTENT_VIEW';

    #[\Override]
    protected function supports(string $attribute, mixed $subject): bool
    {
        return in_array($attribute, [
            self::CHANNEL_VIEW, self::CHANNEL_EDIT, self::CHANNEL_ADD,
            self::SUBSCRIPTION_VIEW, self::SUBSCRIPTION_EDIT, self::SUBSCRIPTION_ADD,
            self::INTENT_VIEW,
        ], true) && $subject instanceof TenantAwareInterface;
    }

    #[\Override]
    protected function voteOnAttribute(string $attribute, mixed $subject, TokenInterface $token): bool
    {
        $user = $token->getUser();

        if (!$user instanceof User) {
            return false;
        }

        switch ($attribute) {
            case self::CHANNEL_VIEW:
            case self::CHANNEL_EDIT:
            case self::SUBSCRIPTION_VIEW:
            case self::SUBSCRIPTION_EDIT:
            case self::INTENT_VIEW:
                $tenant = $subject->getTenant();
                if (null !== $tenant) {
                    return $tenant->getId() === $user->getId();
                }
                break;

            case self::CHANNEL_ADD:
            case self::SUBSCRIPTION_ADD:
                return true;
        }

        return false;
    }
}
