<?php

declare(strict_types=1);

namespace Ari\Service;

use Ari\Entity\ContactPlaybook;
use Ari\Entity\ContactTask;
use Ari\Repository\ContactTaskRepository;
use Doctrine\ORM\EntityManagerInterface;

/**
 * Generates ContactTask records for a playbook.
 *
 * Strategy: lazy generation — only creates the next task in each series
 * when the previous one is completed or does not exist yet.
 *
 * Called at:
 *   - Playbook activation (create first task per series)
 *   - Task completion/skip (create next task in same series)
 *   - OverdueTaskGeneratorCommand daily run (gap-fill for inactive users)
 */
final class ContactTaskGeneratorService
{
    public function __construct(
        private readonly PlaybookTemplateRegistry $registry,
        private readonly ContactTaskRepository $taskRepository,
        private readonly EntityManagerInterface $em,
    ) {
    }

    /**
     * Creates the first task for each series defined in the playbook's preset.
     * Called at activation.
     */
    public function generateInitialTasks(ContactPlaybook $playbook): void
    {
        $config = $this->registry->findByPreset($playbook->getPreset());
        $today = new \DateTimeImmutable('today');

        foreach ($config->tasks as $taskConfig) {
            $task = $this->createTask($playbook, $taskConfig, $today);
            $this->em->persist($task);
        }
    }

    /**
     * Creates the next task in the same series after a task is completed or archived.
     * Due date = today + frequencyDays from the template.
     */
    public function generateNextTask(ContactTask $completedTask): void
    {
        $playbook = $completedTask->getPlaybook();

        if (null === $playbook) {
            return; // standalone task, no series
        }

        if (ContactPlaybook::STATUS_ACTIVE !== $playbook->getStatus()) {
            return; // paused or archived playbook — no new tasks
        }

        $config = $this->registry->findByPreset($playbook->getPreset());
        $seriesKey = $completedTask->getSeriesKey();

        // Find task definition matching this series key
        $taskConfig = null;
        foreach ($config->tasks as $def) {
            if ($def->type === $seriesKey) {
                $taskConfig = $def;
                break;
            }
        }

        if (null === $taskConfig) {
            return; // series not found in preset (preset changed?)
        }

        $dueDate = new \DateTimeImmutable('today +' . $taskConfig->frequencyDays . ' days');
        $task = $this->createTask($playbook, $taskConfig, $dueDate);
        $this->em->persist($task);
    }

    /**
     * Gap-fill: for each series in the preset, if no active task exists (pending/snoozed/awaiting_reflection),
     * create the next task. Used by OverdueTaskGeneratorCommand.
     */
    public function generateMissingTasks(ContactPlaybook $playbook): void
    {
        if (ContactPlaybook::STATUS_ACTIVE !== $playbook->getStatus()) {
            return;
        }

        $config = $this->registry->findByPreset($playbook->getPreset());
        $today = new \DateTimeImmutable('today');

        foreach ($config->tasks as $taskConfig) {
            $seriesKey = $taskConfig->type;

            // Check if an active task exists for this series
            $existing = $this->taskRepository->findActiveTaskForSeries($playbook, $seriesKey);
            if (null !== $existing) {
                continue; // series is covered
            }

            // Find the most recent completed/archived task in this series to compute due date
            $lastTask = $this->taskRepository->findLastTaskForSeries($playbook, $seriesKey);
            $completedAt = $lastTask?->getCompletedAt();
            if (null !== $lastTask && null !== $completedAt) {
                $dueDate = $completedAt->modify('+' . $taskConfig->frequencyDays . ' days');
                // If computed due date is in the past, use today
                if ($dueDate < $today) {
                    $dueDate = $today;
                }
            } else {
                $dueDate = $today;
            }

            $task = $this->createTask($playbook, $taskConfig, $dueDate);
            $this->em->persist($task);
        }
    }

    private function createTask(ContactPlaybook $playbook, PlaybookTaskConfig $taskConfig, \DateTimeImmutable $dueDate): ContactTask
    {
        $contact = $playbook->getContact();
        if (null === $contact) {
            throw new \LogicException('Playbook must have a contact.');
        }

        $task = new ContactTask();
        $task->setContact($contact);
        $task->setPlaybook($playbook);
        $task->setType($taskConfig->type);
        $task->setSeriesKey($taskConfig->type);
        $task->setIsOffline($taskConfig->isOffline);
        $task->setDueDate($dueDate);
        $task->setStatus(ContactTask::STATUS_PENDING);

        $tenant = $playbook->getTenant();
        if (null !== $tenant) {
            $task->setTenant($tenant);
        }

        return $task;
    }
}
