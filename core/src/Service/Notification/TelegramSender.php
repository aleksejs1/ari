<?php

namespace App\Service\Notification;

use App\Entity\NotificationQueue;
use Symfony\Component\DependencyInjection\Attribute\AsTaggedItem;

#[AsTaggedItem(index: 'telegram')]
class TelegramSender implements NotificationSenderInterface
{
    #[\Override]
    public function send(NotificationQueue $task): void
    {
        // Do nothing, this is a placeholder to verify system functionality.
    }
}
