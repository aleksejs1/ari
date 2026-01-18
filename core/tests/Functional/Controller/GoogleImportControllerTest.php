<?php

namespace App\Tests\Functional\Controller;

use App\Entity\User;
use App\Service\Google\GoogleContactsService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class GoogleImportControllerTest extends WebTestCase
{
    public function testImportContactsSuccess(): void
    {
        $client = static::createClient();
        $client->disableReboot(); // Critical: keep container alive for mocking and state

        $container = $client->getContainer(); // Use client container

        // 0. Mock Service (IMMEDIATELY to avoid initialization by other services)
        $googleService = $this->createMock(GoogleContactsService::class);
        $googleService->expects($this->once())
            ->method('importContacts')
            ->willReturn(5);
        $container->set(GoogleContactsService::class, $googleService);

        // 1. Setup User (Directly via container)
        /** @var EntityManagerInterface $em */
        $em = $container->get('doctrine')->getManager();

        $userUuid = 'import-user-' . bin2hex(random_bytes(4));
        $user = new User();
        $user->setUuid($userUuid);
        $hasher = $container->get('security.user_password_hasher');
        $user->setPassword($hasher->hashPassword($user, 'pass'));
        $em->persist($user);
        $em->flush();



        // 3. Get Token (Using SAME client)
        $loginJson = json_encode(['username' => $userUuid, 'password' => 'pass']);
        self::assertIsString($loginJson);

        $client->request(
            'POST',
            '/api/login_check',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            $loginJson,
        );
        $loginResponse = $client->getResponse();
        $loginContent = $loginResponse->getContent();
        self::assertIsString($loginContent);
        self::assertEquals(200, $loginResponse->getStatusCode(), 'Login failed: ' . $loginContent);

        $tokenData = json_decode($loginContent, true);
        $token = $tokenData['token'];

        // 4. Request Import (Using SAME client, with token)
        $jsonContent = json_encode(['add_google_group' => true]);
        self::assertIsString($jsonContent);

        $client->request(
            'POST',
            '/api/google/import',
            [],
            [],
            [
                'CONTENT_TYPE' => 'application/json',
                'HTTP_AUTHORIZATION' => 'Bearer ' . $token,
            ],
            $jsonContent,
        );

        $response = $client->getResponse();
        $content = $response->getContent();
        self::assertIsString($content, 'Response content should be a string');

        self::assertEquals(200, $response->getStatusCode(), $content);

        $json = json_decode($content, true);
        self::assertIsArray($json);
        self::assertArrayHasKey('imported', $json);
        self::assertEquals(5, $json['imported']);
    }
}
