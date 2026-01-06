<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\Dto\NotificationPolicy\NotificationPolicyDto;
use App\Entity\NotificationPolicy;
use Doctrine\ORM\EntityManagerInterface;
use ApiPlatform\Metadata\CollectionOperationInterface;

/**
 * @implements ProviderInterface<NotificationPolicyDto>
 */
class NotificationPolicyProvider implements ProviderInterface
{
    public function __construct(
        private EntityManagerInterface $em,
    ) {
    }

    #[\Override]
    public function provide(Operation $operation, array $uriVariables = [], array $context = []): object|array|null
    {
        if ($operation instanceof CollectionOperationInterface) {
            // Support collection if needed, or rely on default?
            // If output is set to DTO, existing provider returns Entity, which serializer tries to map to DTO?
            // If I define provider at resource level, it overrides ALL.
            // Let's handle Collection too.
            $entities = $this->em->getRepository(NotificationPolicy::class)->findAll();
            $dtos = [];
            foreach ($entities as $entity) {
                $dtos[] = $this->mapToDto($entity);
            }

            return $dtos;
        }

        $id = $uriVariables['id'] ?? null;
        $entity = $this->em->getRepository(NotificationPolicy::class)->find($id);

        if (!$entity instanceof NotificationPolicy) {
            return null; // API Platform handles 404
        }

        return $this->mapToDto($entity);
    }

    private function mapToDto(NotificationPolicy $policy): NotificationPolicyDto
    {
        $dto = new NotificationPolicyDto();
        $dto->id = $policy->getId();
        $dto->name = $policy->getName();

        $snapshot = $policy->getUiSnapshot() ?? [];

        $dto->targets = $snapshot['targets'] ?? null;
        $dto->eventTypes = $snapshot['eventTypes'] ?? null;
        $dto->schedule = $snapshot['schedule'] ?? null;

        // Ensure we handle basic fields if snapshot is missing (legacy)
        // But for "Simple entity" issue, verifying snapshot presence is key.

        return $dto;
    }
}
