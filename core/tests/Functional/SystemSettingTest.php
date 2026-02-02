<?php

namespace Ari\Tests\Functional;

use Ari\Entity\SystemSetting;

class SystemSettingTest extends AbstractApiTestCase
{
    public function testGetSystemSettingAsUser(): void
    {
        // Ensure the setting exists
        $this->ensureSettingExists('community_plugins_enabled', '0');

        static::createClient()->request('GET', '/api/system_settings/community_plugins_enabled', [
            'auth_bearer' => $this->token,
        ]);

        self::assertResponseIsSuccessful();
        self::assertJsonContains(['id' => 'community_plugins_enabled']);
    }

    public function testGetSystemSettingAsAnonymous(): void
    {
        static::createClient()->request('GET', '/api/system_settings/community_plugins_enabled');
        self::assertResponseStatusCodeSame(401);
    }

    public function testUpdateSystemSettingAsAdmin(): void
    {
        $this->ensureSettingExists('community_plugins_enabled', '0');

        $adminToken = $this->getAdminToken();

        static::createClient()->request('PUT', '/api/system_settings/community_plugins_enabled', [
            'auth_bearer' => $adminToken,
            'json' => ['id' => 'community_plugins_enabled', 'value' => '1'],
        ]);

        self::assertResponseIsSuccessful();
        self::assertJsonContains(['value' => '1']);

        // Verify persistence
        $em = $this->getEntityManager();
        $em->clear();
        $setting = $em->find(SystemSetting::class, 'community_plugins_enabled');
        self::assertNotNull($setting);
        self::assertSame('1', $setting->getValue());
    }

    public function testUpdateSystemSettingAsNonAdmin(): void
    {
        $this->ensureSettingExists('community_plugins_enabled', '0');

        // Regular user
        static::createClient()->request('PUT', '/api/system_settings/community_plugins_enabled', [
            'auth_bearer' => $this->token,
            'json' => ['id' => 'community_plugins_enabled', 'value' => '1'],
        ]);

        self::assertResponseStatusCodeSame(403);
    }

    private function ensureSettingExists(string $id, string $value): void
    {
        $em = $this->getEntityManager();
        $setting = $em->find(SystemSetting::class, $id);

        if ($setting === null) {
            $setting = new SystemSetting($id, $value);
            $em->persist($setting);
        } else {
            $setting->setValue($value);
        }

        $em->flush();
    }

    private function getAdminToken(): string
    {
        $container = self::getContainer();
        $em = $container->get('doctrine')->getManager();
        $user = $em->getRepository(\Ari\Entity\User::class)->findOneBy(['uuid' => 'test@example.com']);
        self::assertNotNull($user);

        $user->setRoles(['ROLE_ADMIN']);
        $em->persist($user);
        $em->flush();

        // Get the token for the admin user
        $response = static::createClient()->request('POST', '/api/login_check', [
            'json' => [
                'username' => 'test@example.com',
                'password' => 'password',
            ],
        ]);

        return $response->toArray()['token'];
    }
}
