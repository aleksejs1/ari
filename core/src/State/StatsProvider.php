<?php

namespace Ari\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use Ari\ApiResource\Stats;
use Ari\Entity\AuditLog;
use Ari\Entity\Contact;
use Ari\Entity\NotificationQueue;
use Doctrine\ORM\EntityManagerInterface;

/**
 * @implements ProviderInterface<Stats>
 */
final readonly class StatsProvider implements ProviderInterface
{
    public function __construct(
        private readonly EntityManagerInterface $entityManager,
    ) {
    }

    /**
     * @param array<string, mixed> $uriVariables
     * @param array<string, mixed> $context
     */
    #[\Override]
    public function provide(Operation $operation, array $uriVariables = [], array $context = []): Stats
    {
        $contactCount = $this->entityManager->getRepository(Contact::class)->count([]);
        $auditLogCount = $this->entityManager->getRepository(AuditLog::class)->count([]);
        $notificationCount = $this->entityManager->getRepository(NotificationQueue::class)->count(['status' => 'sent']);

        return new Stats(
            totalContacts: $contactCount,
            totalAuditLogs: $auditLogCount,
            totalSentNotifications: $notificationCount,
        );
    }
}
