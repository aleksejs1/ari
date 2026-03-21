<?php

declare(strict_types=1);

namespace Ari\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use Ari\Dto\TaskReflectionUpdateInput;
use Ari\Entity\TaskReflection;
use Doctrine\ORM\EntityManagerInterface;

/**
 * Handles PATCH /api/task_reflections/{id}.
 *
 * Sets answeredAt when an answer is saved for the first time.
 * Uses TaskReflectionUpdateInput DTO to avoid UnitOfWork::getOriginalEntityData().
 *
 * @implements ProcessorInterface<TaskReflectionUpdateInput, TaskReflection>
 */
final readonly class TaskReflectionProcessor implements ProcessorInterface
{
    public function __construct(private EntityManagerInterface $em)
    {
    }

    #[\Override]
    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): TaskReflection
    {
        if (!$data instanceof TaskReflectionUpdateInput) {
            throw new \InvalidArgumentException(sprintf('Expected %s, got %s.', TaskReflectionUpdateInput::class, get_debug_type($data)));
        }

        $previousData = $context['previous_data'] ?? null;
        if (!$previousData instanceof TaskReflection) {
            throw new \LogicException('previous_data must be a TaskReflection.');
        }

        $reflectionId = $previousData->getId();
        if (null === $reflectionId) {
            throw new \LogicException('TaskReflection must have an ID.');
        }

        // Re-fetch the managed entity so all changes are tracked by the UnitOfWork.
        $reflection = $this->em->find(TaskReflection::class, $reflectionId);
        if (!$reflection instanceof TaskReflection) {
            throw new \LogicException('TaskReflection not found.');
        }

        if (null !== $data->answer) {
            $reflection->setAnswer($data->answer);

            // Set answeredAt only on the first response — subsequent edits update updatedAt (via PreUpdate)
            // but preserve the original answeredAt so it stays a reliable "first-answered" timestamp.
            if (null === $reflection->getAnsweredAt()) {
                $reflection->setAnsweredAt(new \DateTimeImmutable());
            }
        }

        $this->em->flush();

        return $reflection;
    }
}
