<?php

namespace App\Service\Notification;

use App\Entity\NotificationQueue;

interface NotificationSenderInterface
{
    public function send(NotificationQueue $task): void;
}
