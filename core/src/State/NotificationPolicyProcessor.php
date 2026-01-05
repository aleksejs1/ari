<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Dto\NotificationPolicy\NotificationPolicyDto;
use App\Entity\NotificationPolicy;
use App\Entity\NotificationRule;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Override;

/**
 * @implements ProcessorInterface<NotificationPolicyDto, NotificationPolicy>
 */
class NotificationPolicyProcessor implements ProcessorInterface
{
    public function __construct(
        private EntityManagerInterface $em,
        private TokenStorageInterface $tokenStorage
    ) {
    }

    #[Override]
    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): mixed
    {
        $policy = new NotificationPolicy();
        $policy->setName($data->name);
        $policy->setIsActive(true);
        // Deep conversion for uiSnapshot
        $encoded = json_encode($data);
        if ($encoded === false) {
             throw new \RuntimeException('Failed to encode policy data');
        }
        $policy->setUiSnapshot((array)json_decode($encoded, true));

        // Set User
        $token = $this->tokenStorage->getToken();
        $user = $token?->getUser();
        if ($user instanceof User) {
            // Ensure user is managed by current EM
            if (!$this->em->contains($user)) {
                $user = $this->em->getRepository(User::class)->find($user->getId());
            }
            $policy->setUser($user);
        } else {
            throw new \Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException('User context is missing.');
        }

        $this->processRules($policy, $data);

        $this->em->persist($policy);
        $this->em->flush();

        return $policy;
    }

    private function processRules(NotificationPolicy $policy, NotificationPolicyDto $dto): void
    {
        // Clear existing rules if any (conceptually for update, here new policy is empty)
        // $policy->getNotificationRules()->clear();

        $targets = $dto->targets;
        $targetType = $targets['type'] ?? 'group';
        $targetIds = $targets['ids'] ?? [];

        // Pre-fetch channels to avoid repeated queries
        // Collect all channel IDs from all schedule items
        $allChannelIds = [];
        if (is_array($dto->schedule)) {
            foreach ($dto->schedule as $scheduleItem) {
                if (isset($scheduleItem['channels']) && is_array($scheduleItem['channels'])) {
                    foreach ($scheduleItem['channels'] as $chId) {
                        $allChannelIds[] = $chId;
                    }
                }
            }
        }
        $allChannelIds = array_unique($allChannelIds);
        $channels = [];
        foreach ($allChannelIds as $chId) {
            $ch = $this->em->getRepository(\App\Entity\NotificationChannel::class)->find($chId);
            if ($ch instanceof \App\Entity\NotificationChannel) {
                $channels[$chId] = $ch;
            }
        }

        // Iterate Logic
        foreach ($targetIds as $targetId) {
            $group = null;
            // $contact = null; // If we support contact type later

            if ($targetType === 'group') {
                $group = $this->em->getRepository(\App\Entity\Group::class)->find($targetId);
                if (!$group instanceof \App\Entity\Group) {
                    continue; // Or throw exception?
                }
            }
            // Logic for 'contact' type could go here

            foreach ($dto->eventTypes ?? [] as $eventType) {
                if (!is_array($dto->schedule)) {
                    continue;
                }
                foreach ($dto->schedule as $scheduleItem) {
                    $offsetDays = $scheduleItem['offsetDays'] ?? 0;
                    $time = $scheduleItem['time'] ?? '00:00';
                    $itemChannels = $scheduleItem['channels'] ?? [];
                    if (!is_array($itemChannels)) {
                        continue;
                    }

                    foreach ($itemChannels as $channelId) {
                        $channel = $channels[$channelId] ?? null;
                        if (!$channel instanceof \App\Entity\NotificationChannel) {
                            continue;
                        }

                        $rule = new NotificationRule();
                        $rule->setPolicy($policy);
                        $rule->setTenant($policy->getTenant());
                        $rule->setTargetType($targetType);
                        if ($group instanceof \App\Entity\Group) {
                            $rule->setContactGroup($group);
                        }
                        $rule->setEventType($eventType);
                        $rule->setOffsetDays((int)$offsetDays);
                        $rule->setOffsetTime($time);
                        $rule->setChannel($channel);

                        $policy->addNotificationRule($rule);
                        $this->em->persist($rule);
                    }
                }
            }
        }
    }
}
