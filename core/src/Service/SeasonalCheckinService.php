<?php

declare(strict_types=1);

namespace Ari\Service;

use Ari\Entity\ActivityFeed;
use Ari\Entity\User;
use Ari\Repository\ActivityFeedRepository;
use Ari\Repository\ContactPlaybookRepository;
use Doctrine\ORM\EntityManagerInterface;
use Psr\Log\LoggerInterface;

/**
 * Creates seasonal check-in ActivityFeed notifications for users with active playbooks.
 *
 * A seasonal check-in is created when:
 *   - The user has at least one active playbook, AND
 *   - No seasonal_checkin ActivityFeed entry was created for this user in the last 90 days.
 *
 * The command is idempotent: re-running within the 90-day window produces no new entries.
 */
final class SeasonalCheckinService
{
    private const int THRESHOLD_DAYS = 90;

    public function __construct(
        private readonly ContactPlaybookRepository $playbookRepository,
        private readonly ActivityFeedRepository $activityFeedRepository,
        private readonly EntityManagerInterface $em,
        private readonly LoggerInterface $logger,
    ) {
    }

    /**
     * Generates a seasonal_checkin notification for each eligible user.
     *
     * @return int number of notifications created
     */
    public function generateForAllActiveUsers(): int
    {
        $userIds = $this->playbookRepository->findUserIdsWithActivePlaybooks();
        $threshold = new \DateTimeImmutable(sprintf('-%d days', self::THRESHOLD_DAYS));
        $count = 0;

        foreach ($userIds as $userId) {
            $lastCheckin = $this->activityFeedRepository->findLastSeasonalCheckinForUser($userId);
            if (null !== $lastCheckin && $lastCheckin > $threshold) {
                continue;
            }

            // Use a proxy reference to avoid a SELECT per user — sufficient for the FK.
            /** @var User $userRef */
            $userRef = $this->em->getReference(User::class, $userId);

            $feed = new ActivityFeed();
            $feed->setUserId($userId);
            $feed->setEventType('seasonal_checkin');
            $feed->setTitle('Time to review your playbooks');
            $feed->setMessage('Check in with the people who matter to you.');
            $feed->setTenant($userRef);

            $this->em->persist($feed);
            ++$count;

            $this->logger->info('seasonal_checkin_created', ['user_id' => $userId]);
        }

        $this->em->flush();

        return $count;
    }
}
