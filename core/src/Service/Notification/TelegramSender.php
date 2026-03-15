<?php

namespace Ari\Service\Notification;

use Ari\Entity\NotificationQueue;
use Symfony\Component\DependencyInjection\Attribute\AsTaggedItem;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\RateLimiter\RateLimiterFactory;

#[AsTaggedItem(index: 'telegram')]
class TelegramSender implements NotificationSenderInterface
{
    public function __construct(
        private readonly \Ari\Service\TelegramService $telegramService,
        private readonly string $telegramBotSecret,
        #[Autowire(service: 'limiter.telegram_outbound')]
        private readonly RateLimiterFactory $telegramOutboundLimiter,
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

        // Respect Telegram's global 30 msg/s bot limit. The limiter is keyed to a single
        // 'global' slot because the restriction applies to the bot token, not to individual
        // users. If we are over the budget, sleep until the next window opens.
        $rateLimit = $this->telegramOutboundLimiter->create('global')->consume(1);
        if (!$rateLimit->isAccepted()) {
            $waitSeconds = max(0, $rateLimit->getRetryAfter()->getTimestamp() - time());
            if ($waitSeconds > 0) {
                sleep($waitSeconds);
            }
        }

        $this->telegramService->sendMessage($this->telegramBotSecret, $chatId, $fullMessage);
    }
}
