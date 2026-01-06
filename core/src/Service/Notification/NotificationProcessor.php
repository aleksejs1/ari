<?php

namespace App\Service\Notification;

use App\Repository\NotificationQueueRepository;
use Doctrine\ORM\EntityManagerInterface;
use Psr\Log\LoggerInterface;
use Symfony\Component\DependencyInjection\Attribute\TaggedLocator;
use Symfony\Component\DependencyInjection\ServiceLocator;

class NotificationProcessor
{
    /**
     * @param ServiceLocator<NotificationSenderInterface> $senders
     */
    public function __construct(
        private readonly NotificationQueueRepository $queueRepository,
        private readonly EntityManagerInterface $entityManager,
        #[TaggedLocator('app.notification_sender')]
        private readonly ServiceLocator $senders,
        private readonly LoggerInterface $logger,
    ) {
    }

    public function process(int $limit = 50): int
    {
        $items = $this->queueRepository->findPendingItems($limit);
        $processedCount = 0;

        foreach ($items as $item) {
            $channel = $item->getChannel();
            if (null === $channel) {
                // This should not happen due to database constraints, but for type safety:
                $this->logger->error('Notification item has no channel', ['queue_id' => $item->getId()]);
                $item->setStatus('failed');
                $item->setResult('No channel associated');
                $this->entityManager->flush();
                continue;
            }

            $type = $channel->getType();
            if (null === $type) {
                 $this->logger->error('Notification channel has no type', ['queue_id' => $item->getId()]);
                $item->setStatus('failed');
                $item->setResult('Channel has no type');
                $this->entityManager->flush();
                continue;
            }

            if (!$this->senders->has($type)) {
                $this->logger->error("No sender found for channel type: {$type}", ['queue_id' => $item->getId()]);
                $item->setStatus('failed');
                $item->setResult("No sender found for type: {$type}");
                $this->entityManager->flush();
                continue;
            }

            try {
                $sender = $this->senders->get($type);
                $sender->send($item);

                $item->setStatus('sent');
                $item->setResult('Sent successfully');
                $processedCount++;
            } catch (\Throwable $e) {
                $this->logger->error("Error sending notification: " . $e->getMessage(), [
                    'queue_id' => $item->getId(),
                    'exception' => $e,
                ]);
                $item->setStatus('failed');
                $item->setResult('Error: ' . $e->getMessage());
            }

            $item->setAttempts(($item->getAttempts() ?? 0) + 1);
            $this->entityManager->flush();
        }

        return $processedCount;
    }
}
