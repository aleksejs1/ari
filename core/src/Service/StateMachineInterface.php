<?php

declare(strict_types=1);

namespace Ari\Service;

use Ari\Exception\InvalidStateTransitionException;

interface StateMachineInterface
{
    /**
     * @throws InvalidStateTransitionException if the transition is not allowed
     */
    public function assertTransitionAllowed(string $from, string $to): void;
}
