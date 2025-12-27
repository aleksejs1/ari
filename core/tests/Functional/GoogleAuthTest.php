<?php

namespace App\Tests\Functional;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use App\Entity\User;
use Symfony\Component\HttpFoundation\Response;

class GoogleAuthTest extends ApiTestCase
{
    protected static ?bool $alwaysBootKernel = true;

    private function getAuthToken(): string
    {
        $client = self::createClient();
        $container = self::getContainer();

        $uuid = 'test-user-' . bin2hex(random_bytes(4));
        $user = new User();
        $user->setUuid($uuid);

        /** @var \Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface $hasher */
        $hasher = $container->get('security.user_password_hasher');
        $user->setPassword($hasher->hashPassword($user, 'password'));

        /** @var \Doctrine\Persistence\ManagerRegistry $doctrine */
        $doctrine = $container->get('doctrine');
        $entityManager = $doctrine->getManager();
        $entityManager->persist($user);
        $entityManager->flush();

        $response = $client->request('POST', '/api/login_check', [
            'json' => [
                'username' => $uuid,
                'password' => 'password',
            ],
        ]);

        return $response->toArray()['token'];
    }

    public function testConnectGoogleStartReturnsJsonUrlWithState(): void
    {
        $token = $this->getAuthToken();
        $client = self::createClient();

        $response = $client->request('GET', '/connect/google', ['auth_bearer' => $token]);

        self::assertResponseIsSuccessful();
        self::assertResponseHeaderSame('content-type', 'application/json');

        $content = $response->toArray();

        self::assertArrayHasKey('url', $content);
        self::assertStringContainsString('state=', $content['url']);
    }

    public function testConnectGoogleCheckRequiresCodeAndState(): void
    {
        $client = self::createClient();

        $client->request('GET', '/connect/google/check');
        self::assertResponseStatusCodeSame(Response::HTTP_BAD_REQUEST);

        $client->request('GET', '/connect/google/check', ['query' => ['code' => 'test']]);
        self::assertResponseStatusCodeSame(Response::HTTP_BAD_REQUEST);
    }
}
