<?php

declare(strict_types=1);

namespace Ari\Service;

use Ari\Entity\Contact;
use Ari\Entity\ContactPlaybook;
use Ari\Entity\ContactTask;
use Ari\Entity\User;
use Ari\Repository\ContactPlaybookRepository;
use Ari\Repository\ContactTaskRepository;
use Doctrine\ORM\EntityManagerInterface;
use Psr\Log\LoggerInterface;

final class ContactPlaybookService
{
    public function __construct(
        private readonly ContactPlaybookRepository $playbookRepository,
        private readonly ContactTaskRepository $taskRepository,
        private readonly PlaybookTemplateRegistry $registry,
        private readonly ContactTaskGeneratorService $generator,
        private readonly EntityManagerInterface $em,
        private readonly LoggerInterface $logger,
    ) {
    }

    /**
     * Activates a playbook for a contact.
     * Archives any existing active playbook first.
     * Wrapped in a transaction to prevent partial state.
     *
     * @param list<string>|null $whyTags
     */
    public function activate(Contact $contact, string $preset, ?array $whyTags, ?string $whyText, User $user): ContactPlaybook
    {
        // Validate preset first (throws if unknown)
        $config = $this->registry->findByPreset($preset);

        return $this->em->wrapInTransaction(function () use ($contact, $preset, $config, $whyTags, $whyText, $user): ContactPlaybook {
            // Archive existing active playbook
            $existing = $this->playbookRepository->findActiveForContact($contact);
            if (null !== $existing) {
                $this->archive($existing, 'switch');
            }

            // Create new playbook
            $playbook = new ContactPlaybook();
            $playbook->setContact($contact);
            $playbook->setPreset($preset);
            $playbook->setGoal($config->goal);
            $playbook->setWhyTags($whyTags);
            $playbook->setWhyText($whyText);
            $playbook->setStatus(ContactPlaybook::STATUS_ACTIVE);
            $playbook->setTenant($user);

            $this->em->persist($playbook);
            $this->em->flush(); // need ID for task FK

            // Generate initial tasks
            $this->generator->generateInitialTasks($playbook);
            $this->em->flush();

            $this->logger->info('playbook_activated', [
                'tenant_id' => $user->getId(),
                'contact_id' => $contact->getId(),
                'preset' => $preset,
                'goal' => $config->goal,
            ]);

            return $playbook;
        });
    }

    public function archive(ContactPlaybook $playbook, string $reason = 'user_delete'): void
    {
        $playbook->setStatus(ContactPlaybook::STATUS_ARCHIVED);

        // Archive pending and awaiting_reflection tasks (both are still "open" tasks).
        // awaiting_reflection tasks must be archived too — otherwise they outlive the
        // playbook and ReflectionFinalisationCommand would later complete them "into
        // a deleted playbook", generating orphan next-tasks.
        $this->archiveTasksForPlaybook($playbook, [ContactTask::STATUS_PENDING, ContactTask::STATUS_AWAITING_REFLECTION]);

        $this->logger->info('playbook_archived', [
            'tenant_id' => $playbook->getTenant()?->getId(),
            'contact_id' => $playbook->getContact()?->getId(),
            'preset' => $playbook->getPreset(),
            'reason' => $reason,
        ]);
    }

    public function pause(ContactPlaybook $playbook): void
    {
        $playbook->setStatus(ContactPlaybook::STATUS_PAUSED);
        $this->archiveTasksForPlaybook($playbook, [ContactTask::STATUS_PENDING], ContactTask::STATUS_PAUSED);

        $this->logger->info('playbook_paused', [
            'tenant_id' => $playbook->getTenant()?->getId(),
            'contact_id' => $playbook->getContact()?->getId(),
            'preset' => $playbook->getPreset(),
        ]);
    }

    public function resume(ContactPlaybook $playbook): void
    {
        $playbook->setStatus(ContactPlaybook::STATUS_ACTIVE);
        $today = new \DateTimeImmutable('today');

        // Find all paused tasks and reset them to pending with today's due date
        $tasks = $this->taskRepository->findBy(['playbook' => $playbook, 'status' => ContactTask::STATUS_PAUSED]);
        foreach ($tasks as $task) {
            $task->setStatus(ContactTask::STATUS_PENDING);
            $task->setDueDate($today);
        }

        $this->logger->info('playbook_resumed', [
            'tenant_id' => $playbook->getTenant()?->getId(),
            'contact_id' => $playbook->getContact()?->getId(),
            'preset' => $playbook->getPreset(),
        ]);
    }

    /**
     * Gap-fills missing tasks for all active playbooks.
     * Called by OverdueTaskGeneratorCommand to avoid a Command→Repository dependency.
     *
     * @return int number of playbooks checked
     */
    public function generateMissingTasksForAllActive(): int
    {
        $playbooks = $this->playbookRepository->findBy(['status' => ContactPlaybook::STATUS_ACTIVE]);

        if ([] === $playbooks) {
            return 0;
        }

        // Batch-load active and last tasks for all playbooks in 2 queries instead of N×K×2.
        $activeByPlaybook = $this->taskRepository->findActiveTasksForPlaybooks($playbooks);
        $lastByPlaybook = $this->taskRepository->findLastTasksForPlaybooks($playbooks);

        foreach ($playbooks as $playbook) {
            $id = $playbook->getId() ?? 0;
            $this->generator->generateMissingTasksBatch(
                $playbook,
                $activeByPlaybook[$id] ?? [],
                $lastByPlaybook[$id] ?? [],
            );
        }
        $this->em->flush();

        return \count($playbooks);
    }

    /**
     * @param list<string>|null $whyTags
     */
    public function updateWhy(ContactPlaybook $playbook, ?array $whyTags, ?string $whyText): void
    {
        $playbook->setWhyTags($whyTags);
        $playbook->setWhyText($whyText);
    }

    /**
     * Checks if the completed task hits a celebration milestone (every 4th completion per series)
     * and sets celebrationPending=true on the playbook if so.
     *
     * The task has been marked COMPLETED in memory but not yet flushed, so we add 1 to the DB count.
     */
    public function checkAndSetCelebration(ContactTask $task): void
    {
        $playbook = $task->getPlaybook();
        if (null === $playbook || $playbook->isCelebrationPending()) {
            return;
        }

        $seriesKey = $task->getSeriesKey();
        if (null === $seriesKey) {
            return;
        }

        // +1 because the current task is not yet flushed to the DB
        $completed = $this->taskRepository->countCompletedForSeries($playbook, $seriesKey) + 1;
        if ($completed > 0 && 0 === $completed % ContactPlaybook::CELEBRATION_MILESTONE) {
            $playbook->setCelebrationPending(true);
        }
    }

    /**
     * Finalises all tasks in awaiting_reflection status whose reflection window has expired.
     * Called by ReflectionFinalisationCommand (runs hourly).
     *
     * Each task is flushed individually so that a failure on one task does not
     * prevent the remaining tasks from being finalised.
     *
     * @return int number of tasks successfully finalised
     */
    public function finaliseOverdueReflections(): int
    {
        $tasks = $this->taskRepository->findOverdueReflections();
        $count = 0;

        foreach ($tasks as $task) {
            try {
                $task->setStatus(ContactTask::STATUS_COMPLETED);
                $task->setCompletedAt(new \DateTimeImmutable());
                $this->generator->generateNextTask($task);
                $this->checkAndSetCelebration($task);
                $this->em->flush();
                ++$count;
                $this->logger->info('reflection_finalised', [
                    'tenant_id' => $task->getTenant()?->getId(),
                    'task_id' => $task->getId(),
                    'task_type' => $task->getType(),
                ]);
            } catch (\Throwable $e) {
                $this->logger->error('reflection_finalisation_failed', [
                    'task_id' => $task->getId(),
                    'error' => $e->getMessage(),
                ]);
                // Detach the failed entity so subsequent flushes are not poisoned
                // by its inconsistent state.
                $this->em->detach($task);
            }
        }

        return $count;
    }

    /**
     * @param list<string> $fromStatuses
     */
    private function archiveTasksForPlaybook(ContactPlaybook $playbook, array $fromStatuses, string $toStatus = ContactTask::STATUS_ARCHIVED): void
    {
        $tasks = $this->taskRepository->findBy(['playbook' => $playbook, 'status' => $fromStatuses]);
        foreach ($tasks as $task) {
            $task->setStatus($toStatus);
        }
    }
}
