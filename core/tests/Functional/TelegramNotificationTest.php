<?php

namespace Ari\Tests\Functional;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use Ari\Command\ProcessNotificationsCommand;
use Ari\Entity\Contact;
use Ari\Entity\ContactDate;
use Ari\Entity\ContactName;
use Ari\Entity\NotificationChannel;
use Ari\Entity\NotificationIntent;
use Ari\Entity\NotificationSubscription;
use Ari\Entity\User;
use Ari\Service\TelegramService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Tester\CommandTester;

class TelegramNotificationTest extends ApiTestCase
{
    protected static ?bool $alwaysBootKernel = true;

    public function testProcessNotificationsCommand(): void
    {
        $container = self::getContainer();
        /** @var \Doctrine\Bundle\DoctrineBundle\Registry $doctrine */
        $doctrine = $container->get('doctrine');
        /** @var EntityManagerInterface $em */
        $em = $doctrine->getManager();

        /** @var \Symfony\Component\DependencyInjection\Container $testContainer */
        $testContainer = $container->get('test.service_container');
        /** @var \Symfony\Component\PasswordHasher\Hasher\UserPasswordHasher $hasher */
        $hasher = $testContainer->get('security.user_password_hasher');

        // 1. Setup Data
        $user = new User();
        $user->setUuid('user-tele-' . bin2hex(random_bytes(4)));
        $user->setPassword($hasher->hashPassword($user, 'pass'));
        $em->persist($user);

        $contact = new Contact();
        $contact->setUser($user);
        $em->persist($contact);

        $contactName = new ContactName($contact);
        $contactName->setGiven('John');
        $contactName->setFamily('Doe');
        $em->persist($contactName);

        $contactDate = new ContactDate($contact);
        $contactDate->setDate(new \DateTime('today'));
        $contactDate->setText('Birthday');
        $em->persist($contactDate);

        $em->flush(); // Need ID for subscription

        $channel = new NotificationChannel();
        $channel->setUser($user);
        $channel->setType('telegram');
        $channel->setConfig(['botToken' => 'test_token', 'chatId' => 'fake_chat']);
        $em->persist($channel);

        $sub = new NotificationSubscription();
        $sub->setUser($user);
        $sub->setChannel($channel);
        $sub->setEntityType(ContactDate::class);
        $sub->setEntityId((int) $contactDate->getId());
        $sub->setEnabled(1);
        $em->persist($sub);

        $em->flush();

        // 2. Mock TelegramService with Stub + Callback (Spy)
        $telegramServiceStub = self::createStub(TelegramService::class);
        $messageSent = false;
        $telegramServiceStub->method('sendMessage')->willReturnCallback(function ($token, $chatId, $message) use (&$messageSent) {
            if (str_contains($message, 'Birthday')) {
                $messageSent = true;
            }
        });

        // Replace service in container
        $testContainer->set(TelegramService::class, $telegramServiceStub);

        // 3. Run Command
        $em->clear();
        $command = $container->get(ProcessNotificationsCommand::class);
        $commandTester = new CommandTester($command);
        $commandTester->execute([]);

        $commandTester->assertCommandIsSuccessful();
        self::assertStringContainsString('Notification sent', $commandTester->getDisplay());

        // Verify Spy
        self::assertTrue($messageSent, 'TelegramService::sendMessage was not called with expected message.');

        // 4. Verify NotificationIntent was created
        // Clear EM to ensure fresh data
        $em->clear();
        if ($em->getFilters()->isEnabled('tenant')) {
            $em->getFilters()->disable('tenant');
        }
        $intents = $em->getRepository(NotificationIntent::class)->findAll();

        $found = false;
        foreach ($intents as $intent) {
            $intentChannel = $intent->getChannel();
            if (null !== $intentChannel && $intentChannel->getId() === $channel->getId()) {
                $payload = $intent->getPayload();
                if (null !== $payload) {
                    self::assertStringContainsString('Birthday', (string) ($payload['message'] ?? ''));
                }
                $found = true;
                break;
            }
        }
        self::assertTrue($found, 'NotificationIntent was not found');
    }
}
