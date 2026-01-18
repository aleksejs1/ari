<?php

namespace App\Service\Notification;

use App\Entity\NotificationQueue;
use Symfony\Component\DependencyInjection\Attribute\AsTaggedItem;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;

#[AsTaggedItem(index: 'email')]
class EmailSender implements NotificationSenderInterface
{
    public function __construct(
        private readonly MailerInterface $mailer,
        private readonly string $senderEmail = 'no-reply@personal-ari.com',
    ) {
    }

    #[\Override]
    public function send(NotificationQueue $task): void
    {
        $channel = $task->getChannel();
        if (null === $channel) {
            return;
        }

        // 1. Check if verified
        if (null === $channel->getVerifiedAt()) {
            return;
        }

        $config = $channel->getConfig();
        $emailAddress = $config['email'] ?? null;

        if (!is_string($emailAddress) || '' === $emailAddress) {
            return;
        }

        $payload = $task->getPayload();
        $title = $payload['title'] ?? 'New Notification';
        /** @var string|null $messageBody */
        $messageBody = $payload['message'] ?? null;

        $email = (new Email())
            ->from($this->senderEmail)
            ->to($emailAddress)
            ->subject($title)
            ->text($messageBody ?? '')
            ->html($messageBody ?? ''); // Simple fallback, ideally we'd use a template

        try {
            $this->mailer->send($email);
        } catch (\Throwable $e) {
            // Log error or let it bubble up for retry logic depending on architecture
            // For now, we let it bubble so the worker retries
            throw $e;
        }
    }
}
