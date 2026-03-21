<?php

declare(strict_types=1);

namespace Ari\EventSubscriber;

use Ari\Event\TaskCompletedEvent;
use Ari\Service\ContactPlaybookLifecycleService;
use Ari\Service\TaskCompletionLogger;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

/**
 * Handles side-effects when a task is marked completed:
 * - Logs a ContactInteraction for the Keep in Touch timeline.
 * - Checks and sets the playbook celebration milestone.
 *
 * Must execute synchronously (not via Messenger) so that persisted entities
 * are included in the same transaction as the task status update.
 */
final class TaskCompletedSubscriber implements EventSubscriberInterface
{
    public function __construct(
        private readonly TaskCompletionLogger $logger,
        private readonly ContactPlaybookLifecycleService $playbookService,
    ) {
    }

    #[\Override]
    public static function getSubscribedEvents(): array
    {
        return [TaskCompletedEvent::class => 'onTaskCompleted'];
    }

    public function onTaskCompleted(TaskCompletedEvent $event): void
    {
        $task = $event->getTask();
        $this->logger->createInteraction($task);
        $this->playbookService->checkAndSetCelebration($task);
    }
}
