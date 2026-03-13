<?php

namespace Ari\Security\Voter;

use Ari\Entity\User;
use Ari\Security\TenantAwareInterface;
use Ari\Service\Entitlement\EntitlementServiceInterface;
use Ari\Service\Entitlement\EntitlementState;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;
use Symfony\Component\Security\Core\User\UserInterface;

/**
 * @extends Voter<string, TenantAwareInterface>
 */
final class ContactVoter extends Voter
{
    public const EDIT = 'CONTACT_EDIT';
    public const VIEW = 'CONTACT_VIEW';
    public const ADD = 'CONTACT_ADD';

    public function __construct(
        private readonly EntitlementServiceInterface $entitlementService,
    ) {
    }

    #[\Override]
    protected function supports(string $attribute, mixed $subject): bool
    {
        return in_array($attribute, [self::EDIT, self::VIEW, self::ADD], true)
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
                if (!$user instanceof User) {
                    return false;
                }

                // NOTE: check-then-create is not atomic (known limitation, see PLAN_ENTITLEMENTS.md §Phase 2).
                return EntitlementState::Allowed === $this->entitlementService->checkQuota($user, 'contacts');
        }

        return false;
    }
}
