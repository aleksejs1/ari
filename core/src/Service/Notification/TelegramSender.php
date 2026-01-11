<?php

namespace App\Service\Notification;

use App\Entity\NotificationQueue;
use Symfony\Component\DependencyInjection\Attribute\AsTaggedItem;

#[AsTaggedItem(index: 'telegram')]
class TelegramSender implements NotificationSenderInterface
{
    public function __construct(
        private readonly \App\Service\TelegramService $telegramService,
        private readonly string $telegramBotSecret,
    ) {
    }

    #[\Override]
    public function send(NotificationQueue $task): void
    {
        $channel = $task->getChannel();
        if (null === $channel) {
            return;
        }
        $config = $channel->getConfig();
        $chatId = $config['chatId'] ?? null;

        if (!is_string($chatId) || '' === $this->telegramBotSecret) {
            return;
        }

        $payload = $task->getPayload();
        $title = $payload['title'] ?? 'New Notification';
        /** @var string|null $messageBody */
        $messageBody = $payload['message'] ?? null;

        if (
            isset($payload['contactName'])
            && is_string($payload['contactName'])
            && str_contains(strtolower($title), 'birthday')
        ) {
            $title = 'Birthday: ' . $payload['contactName'];
        }

        $fullMessage = sprintf('<b>%s</b>', htmlspecialchars($title, ENT_QUOTES | ENT_SUBSTITUTE | ENT_HTML5));
        if (null !== $messageBody && '' !== $messageBody) {
            $fullMessage .= "\n" . htmlspecialchars($messageBody, ENT_QUOTES | ENT_SUBSTITUTE | ENT_HTML5);
        }

        $this->telegramService->sendMessage($this->telegramBotSecret, $chatId, $fullMessage);
    }
}
