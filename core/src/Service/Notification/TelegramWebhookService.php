<?php

namespace App\Service\Notification;

use App\Entity\NotificationChannel;
use App\Repository\NotificationChannelRepository;
use Doctrine\ORM\EntityManagerInterface;
use Psr\Log\LoggerInterface;

class TelegramWebhookService
{
    public function __construct(
        private readonly EntityManagerInterface $entityManager,
        private readonly NotificationChannelRepository $channelRepository,
        private readonly LoggerInterface $logger,
    ) {
    }

    /**
     * @param array<string, mixed> $payload
     */
    public function handle(array $payload): void
    {
        $message = $payload['message'] ?? null;
        if (!is_array($message) || !isset($message['text'])) {
            return;
        }

        $text = (string) $message['text'];
        $chatId = (string) ($message['chat']['id'] ?? '');

        if ('' === $chatId) {
            return;
        }

        if (!str_starts_with($text, '/start ')) {
            return;
        }

        $param = substr($text, 7);
        $parts = explode('_', $param);

        if (2 !== count($parts)) {
            $this->logger->warning('Invalid Telegram /start parameter format: ' . $param);
            return;
        }

        $userId = (int) $parts[0];
        $channelId = (int) $parts[1];

        // Disable tenant filter to find the channel
        $filters = $this->entityManager->getFilters();
        $isFilterEnabled = $filters->isEnabled('tenant');
        if ($isFilterEnabled) {
            $filters->disable('tenant');
        }

        try {
            $channel = $this->channelRepository->find($channelId);

            if (!$channel instanceof NotificationChannel) {
                $this->logger->warning('Notification channel not found: ' . $channelId);
                return;
            }

            if ('telegram' !== $channel->getType()) {
                $this->logger->warning('Notification channel is not of type telegram: ' . $channelId);
                return;
            }

            $user = $channel->getUser();
            if (null === $user || $user->getId() !== $userId) {
                $this->logger->warning('Telegram webhook user mismatch. Expected User: ' . $userId . ', Channel User: ' . (null !== $user ? (string) $user->getId() : 'null'));
                return;
            }

            $config = $channel->getConfig() ?? [];
            $config['chatId'] = $chatId;
            $channel->setConfig($config);

            $this->entityManager->flush();
            $this->logger->info(sprintf('Telegram chatId updated for channel %d: %s', $channelId, $chatId));
        } finally {
            if ($isFilterEnabled) {
                $filters->enable('tenant');
                // Re-setting the parameter is handled by the security layer usually, 
                // but since we are in a webhook without a logged-in user, 
                // we probably don't need to worry about the parameter value here 
                // as long as we re-enable it for the rest of the request lifecycle if any.
            }
        }
    }
}
