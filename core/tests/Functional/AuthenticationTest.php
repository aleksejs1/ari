<?php

namespace App\Tests\Functional;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use App\Entity\User;

class AuthenticationTest extends ApiTestCase
{
    protected static ?bool $alwaysBootKernel = true;

    public function testLogin(): void
    {
        $client = self::createClient();
        $container = self::getContainer();

        /** @var \Symfony\Component\DependencyInjection\Container $testContainer */
        $testContainer = $container->get('test.service_container');
        /** @var \Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface $hasher */
        $hasher = $testContainer->get('security.user_password_hasher');

        $uuid = 'test-user-' . bin2hex(random_bytes(4));
        $user = new User();
        $user->setUuid($uuid);
        $user->setPassword($hasher->hashPassword($user, '$3cr3t'));

        /** @var \Doctrine\Persistence\ManagerRegistry $doctrine */
        $doctrine = $container->get('doctrine');
        $entityManager = $doctrine->getManager();
        $entityManager->persist($user);
        $entityManager->flush();

        // retrieve a token
        $response = $client->request('POST', '/api/login_check', [
            'headers' => ['Content-Type' => 'application/json'],
            'json' => [
                'username' => $uuid,
                'password' => '$3cr3t',
            ],
        ]);

        $json = $response->toArray();
        self::assertResponseIsSuccessful();
        self::assertArrayHasKey('token', $json);

        // test not authorized
        $client->request('GET', '/api/contacts');
        self::assertResponseStatusCodeSame(401);

        // test authorized
        $client->request('GET', '/api/contacts', ['auth_bearer' => $json['token']]);
        self::assertResponseIsSuccessful();
    }

    public function testRegistration(): void
    {
        $client = self::createClient();

        $uuid = 'new-user-' . bin2hex(random_bytes(4));
        $client->request('POST', '/api/users', [
            'json' => [
                'uuid' => $uuid,
                'plainPassword' => 'new-password',
            ],
        ]);

        self::assertResponseStatusCodeSame(201);
        self::assertJsonContains([
            'uuid' => $uuid,
        ]);

        // Try to login with new user
        $response = $client->request('POST', '/api/login_check', [
            'json' => [
                'username' => $uuid,
                'password' => 'new-password',
            ],
        ]);

        self::assertResponseIsSuccessful();
        self::assertArrayHasKey('token', $response->toArray());
    }
}
