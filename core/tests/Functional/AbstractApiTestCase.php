<?php

namespace App\Tests\Functional;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;

abstract class AbstractApiTestCase extends ApiTestCase
{
    protected static ?bool $alwaysBootKernel = false;

    protected string $token = '';
    protected string $userUuid = '';
    protected bool $autoLogin = true;

    #[\Override]
    protected function setUp(): void
    {
        parent::setUp();

        if ($this->autoLogin) {
            // Default login for tests that explicitly request it
            try {
                $this->token = $this->getToken('test@example.com', 'password');
                $this->userUuid = 'test@example.com';
            } catch (\Exception) {
                // User might not exist yet, create it
                $this->createUser('test@example.com', 'password');
                $this->token = $this->getToken('test@example.com', 'password');
                $this->userUuid = 'test@example.com';
            }
        }
    }

    protected function getEntityManager(): EntityManagerInterface
    {
        $em = self::getContainer()->get('doctrine')->getManager();
        if (!$em instanceof EntityManagerInterface) {
            throw new \RuntimeException('Entity manager not found');
        }

        return $em;
    }

    protected function createUser(string $email, string $password): User
    {
        $container = self::getContainer();
        /** @var \Symfony\Component\DependencyInjection\ContainerInterface $testContainer */
        $testContainer = $container->get('test.service_container');
        /** @var \Symfony\Component\PasswordHasher\Hasher\UserPasswordHasher $hasher */
        $hasher = $testContainer->get('security.user_password_hasher');

        $user = new User();
        $user->setUuid($email);
        $user->setPassword($hasher->hashPassword($user, $password));

        $em = $this->getEntityManager();
        $em->persist($user);
        $em->flush();

        return $user;
    }

    protected function getToken(string $username, string $password): string
    {
        $response = static::createClient()->request('POST', '/api/login_check', [
            'json' => [
                'username' => $username,
                'password' => $password,
            ],
        ]);

        return $response->toArray()['token'];
    }
}
