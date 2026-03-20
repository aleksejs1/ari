<?php

declare(strict_types=1);

namespace Ari\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use Ari\Entity\ContactInteraction;
use Ari\Entity\ContactTask;
use Ari\Entity\TaskReflection;
use Ari\Service\ContactPlaybookService;
use Ari\Service\ContactTaskGeneratorService;
use Ari\Service\PlaybookTemplateRegistry;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;

/**
 * Handles PATCH /api/contact_tasks/{id}.
 *
 * Responsibilities:
 * - Validates status transitions against the allowed state machine.
 * - Applies side-effects: completedAt, reflectionDueAt, snoozedUntil validation.
 * - For offline tasks completing from pending → transitions to awaiting_reflection and creates TaskReflection.
 * - For awaiting_reflection → completed, marks completed and schedules the next task.
 * - Checks and sets celebrationPending milestone after task completion.
 *
 * @implements ProcessorInterface<ContactTask, ContactTask>
 */
final readonly class ContactTaskProcessor implements ProcessorInterface
{
    public function __construct(
        private EntityManagerInterface $em,
        private RequestStack $requestStack,
        private ContactTaskGeneratorService $generator,
        private PlaybookTemplateRegistry $registry,
        private ContactPlaybookService $playbookService,
    ) {
    }

    #[\Override]
    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): ContactTask
    {
        if (!$data instanceof ContactTask) {
            throw new \InvalidArgumentException(sprintf('Expected %s, got %s.', ContactTask::class, get_debug_type($data)));
        }

        $uow = $this->em->getUnitOfWork();
        $originalData = $uow->getOriginalEntityData($data);

        $previousStatus = $originalData['status'] ?? $data->getStatus();
        $requestedStatus = $data->getStatus();

        if ($previousStatus !== $requestedStatus) {
            $this->applyTransition($data, $previousStatus, $requestedStatus);
        } else {
            // No status transition: discard any attempted change to snoozedUntil.
            // Allowing it would let clients silently suppress overdue-detection
            // by setting snoozedUntil to a future date on a non-snoozed task.
            $originalSnoozedUntil = $originalData['snoozedUntil'] ?? null;
            $data->setSnoozedUntil($originalSnoozedUntil instanceof \DateTimeImmutable ? $originalSnoozedUntil : null);
        }

        $this->em->flush();

        return $data;
    }

    private function applyTransition(ContactTask $task, string $from, string $to): void
    {
        $allowed = ContactTask::ALLOWED_TRANSITIONS[$from] ?? [];
        if (!\in_array($to, $allowed, true)) {
            throw new UnprocessableEntityHttpException(
                sprintf('Invalid status transition from %s to %s.', $from, $to),
            );
        }

        // PHPStan narrows $to to the union of all values in ALLOWED_TRANSITIONS at this point,
        // so no default arm is needed (and adding one would cause a match.alwaysTrue notice).
        match ($to) {
            ContactTask::STATUS_COMPLETED => $this->handleComplete($task, $from),
            ContactTask::STATUS_SNOOZED => $this->handleSnooze($task),
            ContactTask::STATUS_ARCHIVED, ContactTask::STATUS_PENDING => $task->setStatus($to),
        };

        // Clear snoozedUntil on every transition except into STATUS_SNOOZED.
        // Prevents a PATCH {"status":"pending","snoozedUntil":"2099-01-01"} from
        // hiding the task from overdue-detection after un-snoozing.
        if (ContactTask::STATUS_SNOOZED !== $to) {
            $task->setSnoozedUntil(null);
        }
    }

    private function handleComplete(ContactTask $task, string $from): void
    {
        if (ContactTask::STATUS_PENDING === $from && $task->isOffline()) {
            // Offline tasks coming from pending wait for morning reflection.
            $task->setStatus(ContactTask::STATUS_AWAITING_REFLECTION);
            $task->setReflectionDueAt($this->computeReflectionDueAt());
            $this->createReflection($task);

            return;
        }

        // pending→completed (online task) or awaiting_reflection→completed
        $task->setStatus(ContactTask::STATUS_COMPLETED);
        $task->setCompletedAt(new \DateTimeImmutable());
        $this->generator->generateNextTask($task);
        $this->playbookService->checkAndSetCelebration($task);
        $this->logInteraction($task);
    }

    /**
     * Maps task type to ContactInteraction type and logs an interaction so that
     * playbook completions appear in the Keep in Touch timeline.
     */
    private function logInteraction(ContactTask $task): void
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

    private function handleSnooze(ContactTask $task): void
    {
        $until = $task->getSnoozedUntil();
        if (null === $until) {
            throw new UnprocessableEntityHttpException(
                'snoozedUntil is required when status is snoozed.',
            );
        }
        if ($until <= new \DateTimeImmutable('today')) {
            throw new UnprocessableEntityHttpException(
                'snoozedUntil must be a future date.',
            );
        }
        $task->setStatus(ContactTask::STATUS_SNOOZED);
    }

    /**
     * Creates a TaskReflection record when an offline task transitions to awaiting_reflection.
     * The question is looked up from the playbook template config for the task's series.
     */
    private function createReflection(ContactTask $task): void
    {
        // Guard against duplicate creation (e.g., repeated PATCH due to client retry).
        // The DB unique constraint would catch it anyway, but this avoids an exception mid-flush.
        if (null !== $task->getReflection()) {
            return;
        }

        $playbook = $task->getPlaybook();
        $question = null;

        if (null !== $playbook) {
            try {
                $config = $this->registry->findByPreset($playbook->getPreset());
                foreach ($config->tasks as $taskConfig) {
                    if ($taskConfig->type === $task->getSeriesKey()) {
                        $question = $taskConfig->question;
                        break;
                    }
                }
            } catch (\InvalidArgumentException) {
                // Preset changed after task was created — use fallback (empty string → frontend uses i18n fallback)
            }
        }

        $tenant = $task->getTenant();
        if (null === $tenant) {
            throw new \LogicException('Task must have a tenant.');
        }

        $reflection = new TaskReflection();
        $reflection->setTask($task);
        $reflection->setQuestion($question ?? '');
        $reflection->setTenant($tenant);
        $this->em->persist($reflection);
    }

    /**
     * Computes "next day at 09:00" in the user's timezone.
     *
     * Timezone resolution order:
     *   1. X-Timezone request header (validated against PHP timezone list)
     *   2. UTC fallback
     */
    private function computeReflectionDueAt(): \DateTimeImmutable
    {
        $tzName = 'UTC';
        $request = $this->requestStack->getCurrentRequest();

        if (null !== $request) {
            $headerTz = $request->headers->get('X-Timezone');
            if (null !== $headerTz && '' !== $headerTz && \in_array($headerTz, \DateTimeZone::listIdentifiers(), true)) {
                $tzName = $headerTz;
            }
        }

        $tz = new \DateTimeZone($tzName);

        return (new \DateTimeImmutable('tomorrow 09:00:00', $tz))->setTimezone(new \DateTimeZone('UTC'));
    }
}
