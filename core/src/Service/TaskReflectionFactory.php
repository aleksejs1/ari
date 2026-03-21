<?php

declare(strict_types=1);

namespace Ari\Service;

use Ari\Entity\ContactTask;
use Ari\Entity\TaskReflection;
use Doctrine\ORM\EntityManagerInterface;

/**
 * Creates TaskReflection records when an offline task transitions to awaiting_reflection.
 * The reflection question is resolved from the playbook template registry.
 */
final class TaskReflectionFactory
{
    public function __construct(
        private readonly PlaybookTemplateRegistry $registry,
        private readonly EntityManagerInterface $em,
    ) {
    }

    /**
     * Creates and persists a TaskReflection for the given task.
     * Guards against duplicate creation (e.g. client retries).
     */
    public function createForTask(ContactTask $task): void
    {
        // In-memory guard against duplicate creation (e.g. client retries within the same request).
        // The actual concurrency protection is the UNIQUE constraint on task_id in the database
        // (see TaskReflection entity). Concurrent requests would result in a constraint violation
        // exception, which is acceptable — the task status transition (pending→awaiting_reflection)
        // is itself atomic within a transaction, making true concurrent duplicates extremely unlikely.
        if (null !== $task->getReflection()) {
            return;
        }

        $tenant = $task->getTenant();
        if (null === $tenant) {
            throw new \LogicException('Task must have a tenant.');
        }

        $question = $this->resolveQuestion($task);

        $reflection = new TaskReflection();
        $reflection->setTask($task);
        $reflection->setQuestion($question);
        $reflection->setTenant($tenant);
        $this->em->persist($reflection);
    }

    private function resolveQuestion(ContactTask $task): string
    {
        $playbook = $task->getPlaybook();
        if (null === $playbook) {
            return '';
        }

        try {
            $config = $this->registry->findByPreset($playbook->getPreset());
            foreach ($config->tasks as $taskConfig) {
                if ($taskConfig->type === $task->getSeriesKey()) {
                    return $taskConfig->question ?? '';
                }
            }
        } catch (\InvalidArgumentException) {
            // Preset changed after task was created — use frontend i18n fallback
        }

        return '';
    }
}
