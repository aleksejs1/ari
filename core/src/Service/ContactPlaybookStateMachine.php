<?php

declare(strict_types=1);

namespace Ari\Service;

use Ari\Entity\ContactPlaybook;
use Ari\Exception\InvalidStateTransitionException;

final class ContactPlaybookStateMachine implements StateMachineInterface
{
    #[\Override]
    public function assertTransitionAllowed(string $from, string $to): void
    {
        $allowed = ContactPlaybook::ALLOWED_TRANSITIONS[$from] ?? [];
        if (!\in_array($to, $allowed, true)) {
            throw new InvalidStateTransitionException('Invalid status transition.');
        }
    }
}
