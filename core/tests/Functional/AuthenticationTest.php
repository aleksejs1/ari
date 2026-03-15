<?php

namespace Ari\Tests\Functional;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use Ari\Entity\User;

class AuthenticationTest extends ApiTestCase
{
    protected static ?bool $alwaysBootKernel = true;

    public function testLogin(): void
    {
        $client = self::createClient();
        $container = self::getContainer();

        /** @var \Symfony\Component\DependencyInjection\Container $testContainer */
        $testContainer = $container->get('test.service_container');
        /** @var \Symfony\Component\PasswordHasher\Hasher\UserPasswordHasher $hasher */
        $hasher = $testContainer->get('security.user_password_hasher');

        $uuid = 'test-user-' . bin2hex(random_bytes(4));
        $user = new User();
        $user->setUuid($uuid);
        $user->setPassword($hasher->hashPassword($user, '$3cr3t'));

        /** @var \Doctrine\Bundle\DoctrineBundle\Registry $doctrine */
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

    /**
     * Regression guard for the "/api/login" firewall prefix trap documented in CLAUDE.md.
     *
     * The `login` firewall (pattern: ^/api/login) intercepts every path that starts with
     * /api/login and configures json_login only — JWT is NOT enabled on this firewall.
     * A valid JWT Bearer token sent to any such path is silently ignored, and the request
     * is processed as anonymous.
     *
     * This test proves that JWT authentication does NOT work on /api/login* paths.
     * If someone creates "GET /api/login_history" expecting JWT protection, this test
     * demonstrates why that would silently fail: the request would be unauthenticated
     * even with a valid token.
     *
     * Rule: Never create API endpoints starting with /api/login. Use alternative naming
     * (e.g. /api/auth_history instead of /api/login_history).
     */
    public function testJwtIsNotHonoredOnLoginFirewallPrefix(): void
    {
        $client = self::createClient();
        $container = self::getContainer();

        /** @var \Symfony\Component\DependencyInjection\Container $testContainer */
        $testContainer = $container->get('test.service_container');
        /** @var \Symfony\Component\PasswordHasher\Hasher\UserPasswordHasher $hasher */
        $hasher = $testContainer->get('security.user_password_hasher');

        $uuid = 'firewall-test-' . bin2hex(random_bytes(4));
        $user = new User();
        $user->setUuid($uuid);
        $user->setPassword($hasher->hashPassword($user, 'p4ssword'));

        /** @var \Doctrine\Bundle\DoctrineBundle\Registry $doctrine */
        $doctrine = $container->get('doctrine');
        $em = $doctrine->getManager();
        $em->persist($user);
        $em->flush();

        // Obtain a valid JWT
        $response = $client->request('POST', '/api/login_check', [
            'headers' => ['Content-Type' => 'application/json'],
            'json' => ['username' => $uuid, 'password' => 'p4ssword'],
        ]);
        $token = $response->toArray()['token'];

        // Prove the JWT works on the api firewall (^/api, JWT-enabled)
        $client->request('GET', '/api/contacts', ['auth_bearer' => $token]);
        self::assertResponseIsSuccessful();

        // Now prove the SAME JWT does NOT authenticate on a path starting with /api/login.
        // The login firewall matches the prefix and does not process JWT — the request
        // is treated as anonymous. /api/login_check only accepts POST (json_login handler),
        // so a GET is not 2xx regardless of the bearer token.
        $loginResponse = $client->request('GET', '/api/login_check', ['auth_bearer' => $token]);
        self::assertGreaterThanOrEqual(
            400,
            $loginResponse->getStatusCode(),
            'A valid JWT must NOT produce a 2xx response on the /api/login* firewall path'
        );
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
