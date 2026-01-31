<?php

namespace Ari\State;

use ApiPlatform\Metadata\IriConverterInterface;
use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use Ari\Dto\NotificationPolicy\NotificationPolicyDto;
use Ari\Entity\NotificationPolicy;
use Ari\Entity\NotificationRule;
use Ari\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

/**
 * @implements ProcessorInterface<NotificationPolicyDto, NotificationPolicy>
 */
class NotificationPolicyProcessor implements ProcessorInterface
{
    public function __construct(
        private EntityManagerInterface $em,
        private TokenStorageInterface $tokenStorage,
        private IriConverterInterface $iriConverter,
    ) {
    }

    #[\Override]
    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): mixed
    {
        $policy = null;

        // Try to fetch existing policy by ID for PUT/PATCH
        if ($operation instanceof \ApiPlatform\Metadata\Put || $operation instanceof \ApiPlatform\Metadata\Patch) {
            $id = $uriVariables['id'] ?? null;
            if (null !== $id) {
                $policy = $this->em->getRepository(NotificationPolicy::class)->find($id);
            }
        }

        // Fallback to previous_data if find failed (e.g. key mismatch) but usually uriVariables is reliable
        if (!$policy instanceof NotificationPolicy) {
            $prev = $context['previous_data'] ?? null;
            if ($prev instanceof NotificationPolicy) {
                $policy = $prev;
            }
        }

        if (!$policy instanceof NotificationPolicy) {
            // Fallback or explicit POST
            $policy = new NotificationPolicy();
            $policy->setIsActive(true);
        }

        // Update fields
        $policy->setName($data->name);

        // Deep conversion for uiSnapshot
        $encoded = json_encode($data);
        if (false === $encoded) {
            throw new \RuntimeException('Failed to encode policy data');
        }
        $policy->setUiSnapshot((array) json_decode($encoded, true));

        // Set User (if not set or just to ensure)
        $token = $this->tokenStorage->getToken();
        $user = $token?->getUser();
        if ($user instanceof User) {
            $userId = $user->getId();
            // Ensure user is managed by current EM
            if (!$this->em->contains($user)) {
                if (null !== $userId) {
                    $user = $this->em->getRepository(User::class)->find($userId);
                }
            }
            if ($user instanceof User) {
                $existingUser = $policy->getUser();
                if (!$existingUser instanceof User || $existingUser->getId() !== $user->getId()) {
                    $policy->setUser($user);
                }
            }
        } else {
            // If we are updating, user might be already set, but we enforce context user check?
            // Or allow system updates? For now, stick to security.
            if (null === $policy->getUser()) {
                throw new \Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException('User context is missing.');
            }
        }

        $this->processRules($policy, $data);

        $this->em->persist($policy);
        $this->em->flush();

        return $policy;
    }

    private function processRules(NotificationPolicy $policy, NotificationPolicyDto $dto): void
    {
        // $policy->getNotificationRules()->clear(); // Don't clear existing rules to preserve IDs

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
            $ch = null;
            if (is_string($chId) && str_starts_with($chId, '/')) {
                try {
                    $ch = $this->iriConverter->getResourceFromIri($chId);
                } catch (\Exception $e) {
                    // Ignore invalid IRI
                }
            } else {
                $ch = $this->em->getRepository(\Ari\Entity\NotificationChannel::class)->find($chId);
            }

            if ($ch instanceof \Ari\Entity\NotificationChannel) {
                $channels[$chId] = $ch;
            }
        }

        // If type is 'all', we iterate once with null target.
        // If type is 'group' or 'contact', iterate over targetIds.
        $loopTargets = [];
        if ('all' === $targetType) {
            $loopTargets = [null];
        } elseif (count($targetIds) > 0) {
            $loopTargets = $targetIds;
        }

        // Keep track of rules that are valid for the current DTO
        $keptRuleIds = [];

        // Iterate Logic
        foreach ($loopTargets as $targetId) {
            $group = null;

            if ('group' === $targetType && null !== $targetId) {
                $group = null;
                if (is_string($targetId) && str_starts_with($targetId, '/')) {
                    try {
                        $group = $this->iriConverter->getResourceFromIri($targetId);
                    } catch (\Exception $e) {
                        // Fallback or ignore? Usually valid IRI required if it starts with /
                    }
                } else {
                    $group = $this->em->getRepository(\Ari\Entity\Group::class)->find($targetId);
                }

                if (!$group instanceof \Ari\Entity\Group) {
                    continue;
                }
            }

            $contact = null;
            if ('contact' === $targetType && null !== $targetId) {
                if (is_string($targetId) && str_starts_with($targetId, '/')) {
                    try {
                        $contact = $this->iriConverter->getResourceFromIri($targetId);
                    } catch (\Exception $e) {
                        // Fallback or ignore
                    }
                } else {
                    $contact = $this->em->getRepository(\Ari\Entity\Contact::class)->find($targetId);
                }

                if (!$contact instanceof \Ari\Entity\Contact) {
                    continue;
                }
            }

            $loopEventTypes = $dto->eventTypes;
            if (null === $loopEventTypes || 0 === count($loopEventTypes)) {
                $loopEventTypes = [null];
            }

            foreach ($loopEventTypes as $eventType) {
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
                        if (!$channel instanceof \Ari\Entity\NotificationChannel) {
                            continue;
                        }

                        // Check if rule already exists
                        $exists = false;
                        foreach ($policy->getNotificationRules() as $existingRule) {
                            if ($existingRule->getTargetType() !== $targetType) {
                                continue;
                            }
                            if ($eventType !== $existingRule->getEventType()) {
                                continue;
                            }
                            if ((int) $offsetDays !== $existingRule->getOffsetDays()) {
                                continue;
                            }
                            if ($time !== $existingRule->getOffsetTime()) {
                                continue;
                            }
                            if ($channel->getId() !== $existingRule->getChannel()?->getId()) {
                                continue;
                            }

                            // Check relations
                            if ('group' === $targetType) {
                                if ($group?->getId() !== $existingRule->getContactGroup()?->getId()) {
                                    continue;
                                }
                            }
                            if ('contact' === $targetType) {
                                if ($contact?->getId() !== $existingRule->getContact()?->getId()) {
                                    continue;
                                }
                            }

                            $exists = true;
                            $keptRuleIds[] = $existingRule->getId();
                            break;
                        }

                        if ($exists) {
                            continue;
                        }

                        $rule = new NotificationRule();
                        $rule->setPolicy($policy);
                        $rule->setTenant($policy->getTenant());
                        $rule->setTargetType($targetType);
                        if ($group instanceof \Ari\Entity\Group) {
                            $rule->setContactGroup($group);
                        }
                        if ($contact instanceof \Ari\Entity\Contact) {
                            $rule->setContact($contact);
                        }
                        $rule->setEventType($eventType);
                        $rule->setOffsetDays((int) $offsetDays);
                        $rule->setOffsetTime($time);
                        $rule->setChannel($channel);

                        $policy->addNotificationRule($rule);
                        $this->em->persist($rule);
                        // New rules are automatically "kept" since they are in the collection now.
                        // But since we use keptRuleIds to remove OLD ones,
                        // we just need to ensure we don't remove newly added ones.
                        // Wait, newly added rule might not have ID yet if not flushed,
                        // but it's not in the original collection loop anyway.
                        // Actually, better logic: iterate existing rules and remove if ID not in keptRuleIds.
                        // But newly added rules don't have ID. So we must filter only existing ones.
                    }
                }
            }
        }

        // Cleanup Logic
        // We iterate over a copy or standard collection
        foreach ($policy->getNotificationRules() as $existingRule) {
            // If it's a new entity (no ID), skip invalidation check
            if (null === $existingRule->getId()) {
                continue;
            }

            if (!in_array($existingRule->getId(), $keptRuleIds, true)) {
                $policy->removeNotificationRule($existingRule);
                $this->em->remove($existingRule); // Ensure physical deletion
            }
        }
    }
}
