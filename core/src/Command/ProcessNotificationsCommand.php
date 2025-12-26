<?php

namespace App\Command;

use App\Entity\Contact;
use App\Entity\ContactDate;
use App\Entity\ContactName;
use App\Entity\NotificationChannel;
use App\Entity\NotificationIntent;
use App\Service\TelegramService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'app:process-notifications',
    description: 'Process all active notification subscriptions and send notifications if criteria met.',
)]
class ProcessNotificationsCommand extends Command
{
    public function __construct(
        private readonly EntityManagerInterface $entityManager,
        private readonly TelegramService $telegramService
    ) {
        parent::__construct();
    }

    #[\Override]
    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $today = new \DateTime('today');

        // Disable tenant filter to see everything
        if ($this->entityManager->getFilters()->isEnabled('tenant')) {
            $this->entityManager->getFilters()->disable('tenant');
        }

        $channels = $this->entityManager->getRepository(NotificationChannel::class)->findBy(['type' => 'telegram']);

        foreach ($channels as $channel) {
            $subs = $channel->getNotificationSubscriptions();
            foreach ($subs as $subscription) {
                if ($subscription->getEnabled() !== 1) {
                    continue;
                }

                $type = $subscription->getEntityType();
                if (null === $type || !str_ends_with($type, 'ContactDate')) {
                    continue;
                }

                $entity = $this->entityManager->find(ContactDate::class, $subscription->getEntityId());
                if (null === $entity) {
                    continue;
                }

                $entityDate = $entity->getDate();
                if (null !== $entityDate && $entityDate->format('Y-m-d') === $today->format('Y-m-d')) {
                    $config = $channel->getConfig() ?? [];
                    /** @var string|null $botToken */
                    $botToken = $config['botToken'] ?? null;
                    /** @var string|null $chatId */
                    $chatId = $config['chatId'] ?? null;

                    if (null === $botToken || null === $chatId) {
                        $io->warning(sprintf('Channel %d is missing botToken or chatId', (int) $channel->getId()));
                        continue;
                    }

                    $contact = $entity->getContact();
                    $name = $contact?->getContactNames()->first();
                    $nameStr = ($name instanceof ContactName)
                        ? trim(($name->getGiven() ?? '') . ' ' . ($name->getFamily() ?? ''))
                        : 'Unknown Contact';

                    $message = sprintf(
                        "<b>Reminder</b>\nContact: %s\nEvent: %s\nDate: %s",
                        $nameStr,
                        $entity->getText() ?? 'No description',
                        $entityDate->format('Y-m-d')
                    );

                    try {
                        $this->telegramService->sendMessage($botToken, $chatId, $message);

                        $intent = new NotificationIntent();
                        $intent->setChannel($channel);
                        $intent->setPayload([
                            'type' => 'telegram',
                            'message' => $message,
                            'sent_at' => date('c')
                        ]);
                        $intent->setTenant($channel->getUser()); // Use user as tenant
                        $this->entityManager->persist($intent);

                        $io->success(sprintf('Notification sent for subscription %d', (int) $subscription->getId()));
                    } catch (\Exception $e) {
                        $io->error(sprintf(
                            'Failed to send notification for subscription %d: %s',
                            (int) $subscription->getId(),
                            $e->getMessage()
                        ));
                    }
                }
            }
        }

        $this->entityManager->flush();

        return Command::SUCCESS;
    }
}
