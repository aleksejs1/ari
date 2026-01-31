<?php

namespace Ari\Service;

use Ari\Entity\ActivityFeed;
use Ari\Entity\User;
use Ari\Repository\ActivityFeedRepository;
use Doctrine\ORM\EntityManagerInterface;

class ActivityManager
{
    public function __construct(
        private readonly EntityManagerInterface $entityManager,
        private readonly ActivityFeedRepository $repository,
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
        ?\DateTimeInterface $expiresAt = null,
        ?User $tenant = null,
    ): void {
        $activity = new ActivityFeed();
        $activity->setUserId($userId);
        $activity->setEventType($eventType);
        $activity->setTitle($title);
        $activity->setMessage($message);
        $activity->setActionData($actionData);
        $activity->setExpiresAt($expiresAt);
        if (null !== $tenant) {
            $activity->setTenant($tenant);
        }

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
