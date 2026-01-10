<?php

namespace App\Service\Notification;

use App\Entity\NotificationQueue;
use App\Service\ActivityManager;
use Symfony\Component\DependencyInjection\Attribute\AsTaggedItem;

#[AsTaggedItem(index: 'web')]
class ActivityFeedSender implements NotificationSenderInterface
{
    public function __construct(
        private readonly ActivityManager $activityManager,
    ) {
    }

    #[\Override]
    public function send(NotificationQueue $task): void
    {
        $contact = $task->getContact();
        if (null === $contact) {
            return;
        }

        $user = $contact->getUser();
        // PHPStan says User is not nullable on Contact.
        // We trust PHPStan here.

        $userId = $user->getId();
        if (null === $userId) {
            return;
        }

        $payload = $task->getPayload();

        // Mapping logic: extract title, message, etc. from payload.
        // Assuming payload has 'title' and 'message'. If not, we might need a formatter.

        $title = $payload['title'] ?? 'New Notification';
        /** @var string|null $message */
        $message = $payload['message'] ?? null;
        /** @var string $eventType */
        $eventType = $payload['eventType'] ?? 'system';
        /** @var array<mixed>|null $actionData */
        $actionData = $payload['actionData'] ?? null;

        // If specific event types need specific formatting, we can add logic here.
        // For example, if it's a birthday event.
        if (
            isset($payload['contactName'])
            && is_string($payload['contactName'])
            && str_contains(strtolower($title), 'birthday')
        ) {
            $title = 'Birthday: ' . $payload['contactName'];
        }

        $this->activityManager->createActivity(
            userId: $userId,
            eventType: $eventType,
            title: $title,
            message: $message,
            actionData: $actionData,
            tenant: $task->getTenant(),
        );
    }
}
