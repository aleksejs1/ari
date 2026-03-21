<?php

declare(strict_types=1);

namespace Ari\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use Ari\Dto\ContactTaskUpdateInput;
use Ari\Entity\ContactTask;
use Ari\Event\TaskCompletedEvent;
use Ari\Service\ContactTaskGeneratorService;
use Ari\Service\ReflectionScheduler;
use Ari\Service\StateMachineInterface;
use Ari\Service\TaskReflectionFactory;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;

/**
 * Handles PATCH /api/contact_tasks/{id}.
 *
 * Receives a ContactTaskUpdateInput DTO; the original ContactTask entity
 * is available via $context['previous_data'] (API Platform standard mechanism).
 *
 * @implements ProcessorInterface<ContactTaskUpdateInput, ContactTask>
 */
final readonly class ContactTaskProcessor implements ProcessorInterface
{
    public function __construct(
        private EntityManagerInterface $em,
        private StateMachineInterface $stateMachine,
        private ContactTaskGeneratorService $generator,
        private TaskReflectionFactory $reflectionFactory,
        private ReflectionScheduler $reflectionScheduler,
        private EventDispatcherInterface $eventDispatcher,
        private Security $security,
    ) {
    }

    #[\Override]
    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): ContactTask
    {
        if (!$data instanceof ContactTaskUpdateInput) {
            throw new \InvalidArgumentException(sprintf('Expected %s, got %s.', ContactTaskUpdateInput::class, get_debug_type($data)));
        }

        $previousData = $context['previous_data'] ?? null;
        if (!$previousData instanceof ContactTask) {
            throw new \LogicException('previous_data must be a ContactTask.');
        }

        // previous_data is a clone (not Doctrine-managed). Re-fetch the managed entity
        // from the identity map to ensure all changes are tracked by the UnitOfWork.
        $taskId = $previousData->getId();
        if (null === $taskId) {
            throw new \LogicException('ContactTask must have an ID.');
        }
        $task = $this->em->find(ContactTask::class, $taskId);
        if (!$task instanceof ContactTask) {
            throw new \LogicException('ContactTask not found.');
        }

        // Defense-in-depth: verify the current user is authorized to edit this task.
        // The primary enforcement is via #[Patch(security: "is_granted('TASK_EDIT', object)")],
        // but this guard catches any path that bypasses API Platform's security layer.
        if (!$this->security->isGranted('TASK_EDIT', $task)) {
            throw new AccessDeniedHttpException();
        }

        $previousStatus = $previousData->getStatus();
        $requestedStatus = $data->status;

        if (null !== $requestedStatus && $previousStatus !== $requestedStatus) {
            $this->applyTransition($task, $previousStatus, $requestedStatus, $data);
        }

        $this->em->flush();

        return $task;
    }

    private function applyTransition(ContactTask $task, string $from, string $to, ContactTaskUpdateInput $input): void
    {
        $this->stateMachine->assertTransitionAllowed($from, $to);

        match ($to) {
            ContactTask::STATUS_COMPLETED => $this->handleComplete($task, $from),
            ContactTask::STATUS_SNOOZED => $this->handleSnooze($task, $input),
            ContactTask::STATUS_ARCHIVED, ContactTask::STATUS_PENDING => $task->setStatus($to),
            default => throw new \LogicException('Unreachable: stateMachine already validated the transition.'),
        };

        if (ContactTask::STATUS_SNOOZED !== $to) {
            $task->setSnoozedUntil(null);
        }
    }

    private function handleComplete(ContactTask $task, string $from): void
    {
        if (ContactTask::STATUS_PENDING === $from && $task->isOffline()) {
            $task->setStatus(ContactTask::STATUS_AWAITING_REFLECTION);
            $task->setReflectionDueAt($this->reflectionScheduler->computeDueAt());
            $this->reflectionFactory->createForTask($task);

            return;
        }

        $task->setStatus(ContactTask::STATUS_COMPLETED);
        $task->setCompletedAt(new \DateTimeImmutable());
        $this->generator->generateNextTask($task);

        // Dispatch before flush so listener-persisted entities (e.g. ContactInteraction)
        // are included in the same DB transaction. Do NOT add a flush() call before this line.
        $this->eventDispatcher->dispatch(new TaskCompletedEvent($task));
    }

    private function handleSnooze(ContactTask $task, ContactTaskUpdateInput $input): void
    {
        // snoozedUntil is guaranteed non-null and future by Assert\When on ContactTaskUpdateInput.
        \assert(null !== $input->snoozedUntil);
        $task->setSnoozedUntil($input->snoozedUntil);
        $task->setStatus(ContactTask::STATUS_SNOOZED);
    }
}
