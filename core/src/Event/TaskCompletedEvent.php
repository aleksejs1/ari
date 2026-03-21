<?php

declare(strict_types=1);

namespace Ari\Event;

use Ari\Entity\ContactTask;

/**
 * Dispatched synchronously after a ContactTask transitions to STATUS_COMPLETED,
 * and before EntityManager::flush(). This ensures any entities persisted by
 * listeners (e.g. ContactInteraction) are included in the same transaction.
 */
final class TaskCompletedEvent
{
    public function __construct(private readonly ContactTask $task)
    {
    }

    public function getTask(): ContactTask
    {
        return $this->task;
    }
}
