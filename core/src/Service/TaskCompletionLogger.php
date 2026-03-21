<?php

declare(strict_types=1);

namespace Ari\Service;

use Ari\Entity\ContactInteraction;
use Ari\Entity\ContactTask;
use Doctrine\ORM\EntityManagerInterface;

/**
 * Creates a ContactInteraction record when a task is completed,
 * so playbook completions appear in the Keep in Touch timeline.
 */
final class TaskCompletionLogger
{
    public function __construct(private readonly EntityManagerInterface $em)
    {
    }

    public function createInteraction(ContactTask $task): void
    {
        $contact = $task->getContact();
        $tenant = $task->getTenant();

        if (null === $contact || null === $tenant) {
            return;
        }

        $interactionType = match ($task->getType()) {
            ContactTask::TYPE_CALL, ContactTask::TYPE_VIDEO_CALL => 'call',
            ContactTask::TYPE_VISIT, ContactTask::TYPE_DATE_NIGHT,
            ContactTask::TYPE_SHARED_ACTIVITY, ContactTask::TYPE_SURPRISE => 'meeting',
            default => 'message',
        };

        $interaction = new ContactInteraction($contact);
        $interaction->setType($interactionType);
        $interaction->setDescription('');
        $interaction->setTimestamp($task->getCompletedAt() ?? new \DateTimeImmutable());
        $interaction->setInitiator('me');
        $interaction->setTenant($tenant);

        $this->em->persist($interaction);
    }
}
