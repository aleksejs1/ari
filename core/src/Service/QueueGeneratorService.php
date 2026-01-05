<?php

namespace App\Service;

use App\Entity\Contact;
use App\Entity\ContactDate;
use App\Entity\NotificationQueue;
use App\Entity\NotificationRule;
use App\Repository\ContactDateRepository;
use App\Repository\NotificationQueueRepository;
use App\Repository\NotificationRuleRepository;
use Doctrine\ORM\EntityManagerInterface;

class QueueGeneratorService
{
    public function __construct(
        private ContactDateRepository $contactDateRepository,
        private NotificationRuleRepository $notificationRuleRepository,
        private NotificationQueueRepository $notificationQueueRepository,
        private EntityManagerInterface $entityManager,
    ) {
    }

    public function generate(\DateTimeInterface $executionDate): int
    {
        $createdCount = 0;

        // 1. Fetch all active rules to find relevant offsets
        $rules = $this->notificationRuleRepository->findAll();

        // Group rules by offset to minimize queries
        $rulesByOffset = [];
        foreach ($rules as $rule) {
            $offset = $rule->getOffsetDays() ?? 0;
            $rulesByOffset[$offset][] = $rule;
        }

        foreach ($rulesByOffset as $offset => $offsetRules) {
            // Calculate Target Date: ExecutionDate - Offset
            $targetDate = new \DateTime($executionDate->format('Y-m-d'));
            $targetDate->modify(sprintf('%+d days', -$offset));

            // Find events (birthdays, etc) on this target date (ignoring year)
            $matchingDates = $this->contactDateRepository->findMatchingDates($targetDate);

            foreach ($matchingDates as $contactDate) {
                foreach ($offsetRules as $rule) {
                    if (!$this->isRuleMatchingDate($rule, $contactDate)) {
                        continue;
                    }

                    $recipients = $this->resolveRecipients($rule);

                    foreach ($recipients as $recipient) {
                        if ($this->createQueueItem($rule, $recipient, $executionDate, $contactDate)) {
                            $createdCount++;
                        }
                    }
                }
            }
        }

        $this->entityManager->flush();

        return $createdCount;
    }

    private function isRuleMatchingDate(NotificationRule $rule, ContactDate $contactDate): bool
    {
        // Simple string matching for now.
        // If ContactDate has text "birthday", Rule eventType must be "birthday"
        return strtolower((string)$rule->getEventType()) === strtolower((string)$contactDate->getText());
    }

    /**
     * @return Contact[]
     */
    private function resolveRecipients(NotificationRule $rule): array
    {
        $targetType = strtoupper((string)$rule->getTargetType());

        if ($targetType === 'GROUP') {
            $group = $rule->getContactGroup();
            if ($group === null) {
                return [];
            }

            $recipients = [];
            foreach ($group->getContactGroups() as $contactGroup) {
                $contact = $contactGroup->getContact();
                if ($contact !== null) {
                    $recipients[] = $contact;
                }
            }
            return $recipients;
        }

        if ($targetType === 'CONTACT') {
            $contact = $rule->getContact();
            return $contact !== null ? [$contact] : [];
        }

        return [];
    }

    private function createQueueItem(
        NotificationRule $rule,
        Contact $recipient,
        \DateTimeInterface $executionDate,
        ContactDate $sourceEvent
    ): bool {
        // Idempotency check: Rule + Recipient + ScheduledAt

        $ts = $executionDate->format('U');
        $scheduledAt = \DateTimeImmutable::createFromFormat('U', $ts);
        // If rule has specific time offset? "offsetTime"
        $timeStr = $rule->getOffsetTime();
        if ($timeStr !== null) {
            // Assume format H:i
            try {
                $timeParts = explode(':', $timeStr);
                if (count($timeParts) === 2 && $scheduledAt !== false) {
                    $scheduledAt = $scheduledAt->setTime((int)$timeParts[0], (int)$timeParts[1]);
                }
            } catch (\Exception $e) {
                // Ignore invalid time
            }
        } elseif ($scheduledAt !== false) {
             $scheduledAt = $scheduledAt->setTime(9, 0, 0); // Default 9 AM
        }

        if ($scheduledAt === false) {
            // Should not happen really
            return false;
        }

        // Check duplicates
        $existing = $this->notificationQueueRepository->findOneBy([
            'rule' => $rule,
            'contact' => $recipient,
            'scheduledAt' => $scheduledAt
        ]);

        if ($existing !== null) {
            return false;
        }

        $sourceContact = $sourceEvent->getContact();
        $eventDate = $sourceEvent->getDate();

        if ($sourceContact === null || $eventDate === null) {
            return false;
        }

        $queue = new NotificationQueue();
        $queue->setRule($rule);
        $queue->setContact($recipient);
        $queue->setScheduledAt($scheduledAt);
        $queue->setChannel($rule->getChannel());
        $queue->setStatus('pending');
        $queue->setAttempts(0);

        // Payload
        $payload = [
            'event_type' => $sourceEvent->getText(),
            'subject_contact_id' => $sourceContact->getId(),
            'subject_contact_name' => $sourceContact->getDisplayName(),
            'event_date' => $eventDate->format('Y-m-d'),
        ];
        $queue->setPayload($payload);

        // Tenant info
        $queue->setTenant($recipient->getTenant());

        $this->entityManager->persist($queue);
        return true;
    }
}
