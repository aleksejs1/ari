<?php

declare(strict_types=1);

namespace App\Tests\Functional;

use App\Entity\User;
use PHPUnit\Framework\Attributes\CoversClass;

#[CoversClass(User::class)]
final class UserChangePasswordTest extends AbstractApiTestCase
{
    public function testChangePassword(): void
    {
        $client = static::createClient();

        // Find current user ID
        /** @var \Doctrine\Bundle\DoctrineBundle\Registry $doctrine */
        $doctrine = self::getContainer()->get('doctrine');
        $user = $doctrine->getRepository(User::class)->findOneBy(['uuid' => $this->userUuid]);
        self::assertNotNull($user);

        $client->request('PUT', '/api/profile/change-password', [
            'auth_bearer' => $this->token,
            'json' => [
                'currentPassword' => 'password',
                'newPassword' => 'new-password-123',
            ],
        ]);

        self::assertResponseIsSuccessful();

        // Try login with new password
        $client->request('POST', '/api/login_check', [
            'json' => [
                'username' => $this->userUuid,
                'password' => 'new-password-123',
            ],
        ]);
        self::assertResponseIsSuccessful();

        // Try login with old password - should fail
        $client->request('POST', '/api/login_check', [
            'json' => [
                'username' => $this->userUuid,
                'password' => 'password',
            ],
        ]);
        self::assertResponseStatusCodeSame(401);
    }

    public function testChangePasswordValidation(): void
    {
        $client = static::createClient();

        /** @var \Doctrine\Bundle\DoctrineBundle\Registry $doctrine */
        $doctrine = self::getContainer()->get('doctrine');
        $user = $doctrine->getRepository(User::class)->findOneBy(['uuid' => $this->userUuid]);
        self::assertNotNull($user);

        // Wrong current password
        $client->request('PUT', '/api/profile/change-password', [
            'auth_bearer' => $this->token,
            'json' => [
                'currentPassword' => 'wrong-password',
                'newPassword' => 'new-password-123',
            ],
        ]);
        self::assertResponseStatusCodeSame(400);

        // Too short new password
        $client->request('PUT', '/api/profile/change-password', [
            'auth_bearer' => $this->token,
            'json' => [
                'currentPassword' => 'password',
                'newPassword' => 'short',
            ],
        ]);
        self::assertResponseStatusCodeSame(422);
    }
}
