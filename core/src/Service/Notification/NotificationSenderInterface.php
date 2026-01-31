<?php

namespace Ari\Service\Notification;

use Ari\Entity\NotificationQueue;
use Symfony\Component\DependencyInjection\Attribute\AutoconfigureTag;

#[AutoconfigureTag('app.notification_sender')]
interface NotificationSenderInterface
{
    public function send(NotificationQueue $task): void;
}
