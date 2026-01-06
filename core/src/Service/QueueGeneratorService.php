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
                $contact = $contactDate->getContact();
                if (null === $contact) {
                    continue;
                }

                foreach ($offsetRules as $rule) {
                    if (!$this->isRuleMatchingDate($rule, $contactDate)) {
                        continue;
                    }

                    // Check if contact matches the rule target
                    if (!$this->isContactMatchingRule($contact, $rule)) {
                        continue;
                    }

                    if ($this->createQueueItem($rule, $contact, $executionDate, $contactDate)) {
                        $createdCount++;
                    }
                }
            }
        }

        $this->entityManager->flush();

        return $createdCount;
    }

    private function isRuleMatchingDate(NotificationRule $rule, ContactDate $contactDate): bool
    {
        $eventType = $rule->getEventType();
        // If rule has no event type, it matches ANY event
        if ($eventType === null) {
            return true;
        }

        // Simple string matching for now.
        // If ContactDate has text "birthday", Rule eventType must be "birthday"
        return strtolower($eventType) === strtolower((string)$contactDate->getText());
    }

    private function isContactMatchingRule(Contact $contact, NotificationRule $rule): bool
    {
        $targetType = strtoupper((string)$rule->getTargetType());

        if ($targetType === 'ALL') {
            return true;
        }

        if ($targetType === 'CONTACT') {
            $targetContact = $rule->getContact();
            return $targetContact !== null && $targetContact->getId() === $contact->getId();
        }

        if ($targetType === 'GROUP') {
            $targetGroup = $rule->getContactGroup();
            if ($targetGroup === null) {
                return false;
            }

            // Check if contact is in the group.
            // Assumption: Contact has a collection of ContactGroup entities or similar relation.
            // Or we check from the group side.
            foreach ($targetGroup->getContactGroups() as $cg) {
                if ($cg->getContact()?->getId() === $contact->getId()) {
                    return true;
                }
            }
            return false;
        }

        return false;
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
        $offset = $rule->getOffsetDays() ?? 0;
        $message = sprintf(
            'Contact %s has %s after %d days',
            $sourceContact->getDisplayName(),
            (string) $sourceEvent->getText(),
            $offset
        );

        $payload = [
            'event_type' => $sourceEvent->getText(),
            'subject_contact_id' => $sourceContact->getId(),
            'subject_contact_name' => $sourceContact->getDisplayName(),
            'event_date' => $eventDate->format('Y-m-d'),
            'message' => $message,
        ];
        $queue->setPayload($payload);

        // Tenant info
        $queue->setTenant($recipient->getTenant());

        $this->entityManager->persist($queue);
        return true;
    }
}
