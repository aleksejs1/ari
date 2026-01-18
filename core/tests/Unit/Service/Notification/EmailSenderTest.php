<?php

namespace App\Tests\Unit\Service\Notification;

use App\Entity\NotificationChannel;
use App\Entity\NotificationQueue;
use App\Service\Notification\EmailSender;
use PHPUnit\Framework\TestCase;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;

class EmailSenderTest extends TestCase
{
    public function testSendSkipsUnverifiedChannel(): void
    {
        $mailer = $this->createMock(MailerInterface::class);
        $mailer->expects(self::never())->method('send');

        $sender = new EmailSender($mailer);

        $channel = new NotificationChannel();
        $channel->setVerifiedAt(null); // Not verified

        $task = new NotificationQueue();
        $task->setChannel($channel);

        $sender->send($task);
    }

    public function testSendSendsIfVerified(): void
    {
        $mailer = $this->createMock(MailerInterface::class);
        $mailer->expects(self::once())->method('send')->with(self::callback(function (Email $email) {
            return 'test@example.com' === $email->getTo()[0]->getAddress()
                && 'Test Title' === $email->getSubject();
        }));

        $sender = new EmailSender($mailer);

        $channel = new NotificationChannel();
        $channel->setVerifiedAt(new \DateTimeImmutable());
        $channel->setConfig(['email' => 'test@example.com']);

        $task = new NotificationQueue();
        $task->setChannel($channel);
        $task->setPayload(['title' => 'Test Title', 'message' => 'Hello']);

        $sender->send($task);
    }
}
