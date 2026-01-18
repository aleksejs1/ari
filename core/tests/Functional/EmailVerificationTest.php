<?php

namespace App\Tests\Functional;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use App\Entity\NotificationChannel;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Mime\Email;

class EmailVerificationTest extends ApiTestCase
{
    private string $token = '';
    private string $userUuid = '';

    protected static ?bool $alwaysBootKernel = true;

    #[\Override]
    protected function setUp(): void
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

        // Create User
        $this->userUuid = 'user-verify-' . bin2hex(random_bytes(4));
        $user = new User();
        $user->setUuid($this->userUuid);
        $user->setPassword($hasher->hashPassword($user, 'pass'));
        $em->persist($user);
        $em->flush();

        // Get token
        $this->token = $this->getToken($this->userUuid, 'pass');
    }

    private function getToken(string $username, string $password): string
    {
        $response = static::createClient()->request('POST', '/api/login_check', [
            'json' => [
                'username' => $username,
                'password' => $password,
            ],
        ]);

        return $response->toArray()['token'];
    }

    public function testEmailVerificationFlow(): void
    {
        $client = static::createClient();

        // 1. Create Email Channel
        $response = $client->request('POST', '/api/notification_channels', [
            'auth_bearer' => $this->token,
            'json' => [
                'type' => 'email',
                'config' => ['email' => 'to-verify@example.com'],
            ],
        ]);
        self::assertResponseStatusCodeSame(201);
        $channelId = $response->toArray()['id'];

        // 1.5 Reset Mailer Logger to clear any previous messages (e.g. from creation if any, or previous tests)

        if (static::getContainer()->has('mailer.logger_message_listener')) {
            $logger = static::getContainer()->get('mailer.logger_message_listener');
            if ($logger instanceof \Symfony\Component\Mailer\EventListener\MessageLoggerListener) {
                $logger->reset();
            }
        }

        // 2. Request Verification
        $client->request('POST', "/api/notification_channels/{$channelId}/verify", [
            'auth_bearer' => $this->token,
        ]);
        self::assertResponseIsSuccessful();

        // 3. Check Email
        $messages = self::getMailerMessages();
        
        // When using Messenger with Sync transport, we might get double logging (TraceableMailer + Transport event).
        // We ensure we have at least one message.
        self::assertGreaterThanOrEqual(1, $messages);
        
        /** @var Email $email */
        $email = $messages[0];
        self::assertEmailAddressContains($email, 'To', 'to-verify@example.com');
        self::assertEmailHtmlBodyContains($email, 'public/verify-channel');

        // 4. Extract Link
        $html = (string) $email->getHtmlBody();
        preg_match('/href="([^"]+)"/', $html, $matches);
        self::assertNotEmpty($matches, 'Could not find verification link in email');
        $verificationUrl = html_entity_decode($matches[1]);

        // 5. Verify via Public Link
        // Current client might have auth headers, but public endpoint should not require them.
        // We create a new client request to the extracted path.
        // Note: verificationUrl is absolute. We need to strip host if using internal client or just pass URL.
        // ApiPlatform client can handle absolute URLs if host matches.

        $client->request('GET', $verificationUrl);
        self::assertResponseIsSuccessful();
        self::assertResponseStatusCodeSame(200);

        // 6. Check DB verifiedAt
        $em = static::getContainer()->get('doctrine')->getManager();
        $em->clear();
        /** @var NotificationChannel $channel */
        $channel = $em->getRepository(NotificationChannel::class)->find($channelId);

        self::assertNotNull($channel->getVerifiedAt());
    }
}
