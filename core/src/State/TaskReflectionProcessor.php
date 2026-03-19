<?php

declare(strict_types=1);

namespace Ari\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use Ari\Entity\TaskReflection;
use Doctrine\ORM\EntityManagerInterface;

/**
 * Handles PATCH /api/task_reflections/{id}.
 *
 * Sets answeredAt when an answer is saved for the first time.
 *
 * @implements ProcessorInterface<TaskReflection, TaskReflection>
 */
final readonly class TaskReflectionProcessor implements ProcessorInterface
{
    public function __construct(private EntityManagerInterface $em)
    {
    }

    #[\Override]
    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): TaskReflection
    {
        if (!$data instanceof TaskReflection) {
            throw new \InvalidArgumentException(sprintf('Expected %s, got %s.', TaskReflection::class, get_debug_type($data)));
        }

        $uow = $this->em->getUnitOfWork();
        $originalData = $uow->getOriginalEntityData($data);

        // Set answeredAt only on the first response — subsequent edits update updatedAt (via PreUpdate) but
        // preserve the original answeredAt so it stays a reliable "first-answered" timestamp.
        $originalAnswer = $originalData['answer'] ?? null;
        if (null !== $data->getAnswer() && null === $data->getAnsweredAt() && $originalAnswer !== $data->getAnswer()) {
            $data->setAnsweredAt(new \DateTimeImmutable());
        }

        $this->em->flush();

        return $data;
    }
}
