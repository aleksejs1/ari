<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Entity\NotificationChannel;
use App\Entity\NotificationPolicy;
use App\Entity\NotificationRule;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\DependencyInjection\Attribute\Autowire;

/**
 * @implements ProcessorInterface<User, User>
 */
final readonly class UserInitialSetupProcessor implements ProcessorInterface
{
    /**
     * @param ProcessorInterface<User, User> $innerProcessor
     */
    public function __construct(
        #[Autowire(service: 'App\State\UserPasswordHasherProcessor')]
        private ProcessorInterface $innerProcessor,
        private EntityManagerInterface $entityManager,
    ) {
    }

    /**
     * @param User $data
     */
    #[\Override]
    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): User
    {
        // First, persist the user via the inner processor (hashes password, persists user)
        $user = $this->innerProcessor->process($data, $operation, $uriVariables, $context);

        // Now create default notification settings
        $this->createDefaultNotificationSettings($user);

        return $user;
    }

    private function createDefaultNotificationSettings(User $user): void
    {
        // 1. Create "web" Notification Channel
        $channel = new NotificationChannel();
        $user->addNotificationChannel($channel); // Sets user/tenant
        $channel->setType('web');
        $channel->setConfig([]);
        $channel->setVerifiedAt(new \DateTimeImmutable());
        $channel->setCreatedAt(new \DateTimeImmutable());
        $this->entityManager->persist($channel);

        // Flush to generate ID for the channel, needed for UI Snapshot
        $this->entityManager->flush();

        // 2. Create "Default" Notification Policy
        $policy = new NotificationPolicy();
        $user->addNotificationPolicy($policy); // Sets user/tenant
        $policy->setName('Default');
        $policy->setIsActive(true);

        $policy->setUiSnapshot([
            'id' => null,
            'name' => 'Default',
            'targets' => [
                'type' => 'all',
                'ids' => [],
            ],
            'eventTypes' => [],
            'schedule' => [
                [
                    'offsetDays' => 0,
                    'time' => '09:00',
                    'channels' => ['/api/notification_channels/' . (string) $channel->getId()],
                ],
            ],
        ]);

        $this->entityManager->persist($policy);

        // 3. Create Rule: All contacts, all events, 0 days offset, 9:00 AM
        $rule = new NotificationRule();
        $rule->setTenant($user); // Rule needs tenant explicitly as it doesn't have setUser
        $rule->setPolicy($policy);
        $rule->setChannel($channel);
        $rule->setTargetType('ALL'); // Matches "All contacts"
        $rule->setEventType(null);   // Matches "All event types"
        $rule->setOffsetDays(0);
        $rule->setOffsetTime('09:00');

        $this->entityManager->persist($rule);

        $this->entityManager->flush();
    }
}
