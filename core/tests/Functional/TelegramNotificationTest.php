<?php

namespace App\Tests\Functional;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use App\Command\ProcessNotificationsCommand;
use App\Entity\Contact;
use App\Entity\ContactDate;
use App\Entity\ContactName;
use App\Entity\NotificationChannel;
use App\Entity\NotificationIntent;
use App\Entity\NotificationSubscription;
use App\Entity\User;
use App\Service\TelegramService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Tester\CommandTester;

class TelegramNotificationTest extends ApiTestCase
{
    protected static ?bool $alwaysBootKernel = true;

    public function testProcessNotificationsCommand(): void
    {
        $container = self::getContainer();
        /** @var \Doctrine\Persistence\ManagerRegistry $doctrine */
        $doctrine = $container->get('doctrine');
        /** @var EntityManagerInterface $em */
        $em = $doctrine->getManager();

        /** @var \Symfony\Component\DependencyInjection\Container $testContainer */
        $testContainer = $container->get('test.service_container');
        /** @var \Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface $hasher */
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

        // 2. Mock TelegramService
        $telegramServiceMock = $this->createMock(TelegramService::class);
        $telegramServiceMock->expects(self::atLeastOnce())
            ->method('sendMessage')
            ->with(self::anything(), self::anything(), self::stringContains('Birthday'));

        // Replace service in container
        $testContainer->set(TelegramService::class, $telegramServiceMock);

        // 3. Run Command
        $em->clear();
        /** @var \Symfony\Component\Console\Command\Command $command */
        $command = $container->get(ProcessNotificationsCommand::class);
        $commandTester = new CommandTester($command);
        $commandTester->execute([]);

        $commandTester->assertCommandIsSuccessful();
        self::assertStringContainsString('Notification sent', $commandTester->getDisplay());

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

    public function testValidationFailsMissingConfig(): void
    {
        $container = self::getContainer();

        /** @var \Symfony\Component\Validator\Validator\ValidatorInterface $validator */
        $validator = $container->get('validator');

        $channel = new NotificationChannel();
        $channel->setType('telegram');
        $channel->setConfig(['botToken' => 'only_token']); // Missing chatId

        $errors = $validator->validate($channel);
        self::assertCount(1, $errors);
        $error = $errors->get(0);
        self::assertEquals('Telegram channel requires a chatId.', $error->getMessage());
    }
}
