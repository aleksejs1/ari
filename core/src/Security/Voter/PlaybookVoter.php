<?php

declare(strict_types=1);

namespace Ari\Security\Voter;

use Ari\Entity\ContactPlaybook;
use Ari\Entity\ContactTask;
use Ari\Security\ApiKeyToken;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;
use Symfony\Component\Security\Core\User\UserInterface;

/**
 * Voter for Relationship Playbooks feature.
 *
 * Phase 1: TASK_VIEW, TASK_EDIT (ContactTask — view and mutate)
 * Phase 2 adds: PLAYBOOK_VIEW, PLAYBOOK_EDIT (ContactPlaybook)
 * Phase 3 adds: REFLECTION_EDIT (TaskReflection)
 *
 * Tenant check: $subject->getTenant() === $user (object-level ownership).
 * API key scopes: contacts:read for TASK_VIEW/PLAYBOOK_VIEW, contacts:write for TASK_EDIT/PLAYBOOK_EDIT.
 *
 * @extends Voter<string, ContactTask|ContactPlaybook>
 */
final class PlaybookVoter extends Voter
{
    public const string TASK_VIEW = 'TASK_VIEW';
    public const string TASK_EDIT = 'TASK_EDIT';
    public const string PLAYBOOK_VIEW = 'PLAYBOOK_VIEW';
    public const string PLAYBOOK_EDIT = 'PLAYBOOK_EDIT';

    private const array SUPPORTED_ATTRIBUTES = [
        self::TASK_VIEW,
        self::TASK_EDIT,
        self::PLAYBOOK_VIEW,
        self::PLAYBOOK_EDIT,
    ];

    #[\Override]
    protected function supports(string $attribute, mixed $subject): bool
    {
        if (!\in_array($attribute, self::SUPPORTED_ATTRIBUTES, true)) {
            return false;
        }

        if (\in_array($attribute, [self::TASK_VIEW, self::TASK_EDIT], true)) {
            return $subject instanceof ContactTask;
        }

        return $subject instanceof ContactPlaybook;
    }

    #[\Override]
    protected function voteOnAttribute(string $attribute, mixed $subject, TokenInterface $token): bool
    {
        $user = $token->getUser();

        if (!$user instanceof UserInterface) {
            return false;
        }

        // Scope gate for API key authentication.
        if ($token instanceof ApiKeyToken) {
            $required = match ($attribute) {
                self::TASK_VIEW, self::PLAYBOOK_VIEW => 'contacts:read',
                self::TASK_EDIT, self::PLAYBOOK_EDIT => 'contacts:write',
                default => null,
            };
            if (null !== $required && !$token->hasScope($required)) {
                return false;
            }
        }

        // Object-level tenant ownership check.
        if ($subject instanceof ContactTask || $subject instanceof ContactPlaybook) {
            return $subject->getTenant() === $user;
        }

        return false;
    }
}
