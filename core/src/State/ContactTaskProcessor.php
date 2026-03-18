<?php

namespace Ari\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use Ari\Entity\ContactTask;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;

/**
 * Handles PATCH /api/contact_tasks/{id}.
 *
 * Responsibilities:
 * - Validates status transitions against the allowed state machine.
 * - Applies side-effects: completedAt, reflectionDueAt, snoozedUntil validation.
 * - For offline tasks completing → transitions to awaiting_reflection.
 *
 * Note: Next-task generation (ContactTaskGeneratorService) is Phase 2.
 * This processor only handles the status transition and its direct side-effects.
 *
 * @implements ProcessorInterface<ContactTask, ContactTask>
 */
final readonly class ContactTaskProcessor implements ProcessorInterface
{
    public function __construct(
        private EntityManagerInterface $em,
        private RequestStack $requestStack,
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
            ContactTask::STATUS_COMPLETED => $this->handleComplete($task),
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

    private function handleComplete(ContactTask $task): void
    {
        if ($task->isOffline()) {
            // Offline tasks wait for morning reflection instead of completing immediately.
            $task->setStatus(ContactTask::STATUS_AWAITING_REFLECTION);
            $task->setReflectionDueAt($this->computeReflectionDueAt());
        } else {
            $task->setStatus(ContactTask::STATUS_COMPLETED);
            $task->setCompletedAt(new \DateTimeImmutable());
        }
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
