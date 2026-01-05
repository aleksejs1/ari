<?php

namespace App\Service;

use App\Entity\ActivityFeed;
use App\Entity\User;
use App\Repository\ActivityFeedRepository;
use Doctrine\ORM\EntityManagerInterface;

class ActivityManager
{
    public function __construct(
        private readonly EntityManagerInterface $entityManager,
        private readonly ActivityFeedRepository $repository
    ) {
    }

    /**
     * @param array<string, mixed> $actionData
     */
    public function createActivity(
        int $userId,
        string $eventType,
        string $title,
        ?string $message = null,
        ?array $actionData = null,
        ?\DateTimeInterface $expiresAt = null
    ): void {
        $activity = new ActivityFeed();
        $activity->setUserId($userId);
        $activity->setEventType($eventType);
        $activity->setTitle($title);
        $activity->setMessage($message);
        $activity->setActionData($actionData);
        $activity->setExpiresAt($expiresAt);
        // Tenant will be set automatically by TenantAware listener/trait if we are in a request context
        // If this is run from a command, we might need to manually set it or ensure the user context is correct.
        // Given existing patterns, we'll assume TenantAwareTrait handles it or the caller handles it.

        $this->entityManager->persist($activity);
        $this->entityManager->flush();
    }

    /**
     * @param array<int> $ids
     */
    public function markAsRead(User $user, array $ids): void
    {
        $qb = $this->entityManager->createQueryBuilder();
        $qb->update(ActivityFeed::class, 'a')
            ->set('a.isRead', 'true')
            ->where('a.userId = :userId')
            ->andWhere('a.id IN (:ids)')
            ->setParameter('userId', $user->getId())
            ->setParameter('ids', $ids)
            ->getQuery()
            ->execute();
    }

    public function getUnreadCount(User $user): int
    {
        return $this->repository->count([
            'userId' => $user->getId(),
            'isRead' => false,
        ]);
    }
}
