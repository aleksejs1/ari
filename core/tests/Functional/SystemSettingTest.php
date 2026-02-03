<?php

namespace Ari\Tests\Functional;

use Ari\Entity\SystemSetting;

class SystemSettingTest extends AbstractApiTestCase
{
    public function testGetSystemSettingDefaultValue(): void
    {
        // Ensure setting does NOT exist in DB
        $this->ensureSettingDoesNotExist('community_plugins_enabled');

        static::createClient()->request('GET', '/api/system_settings/community_plugins_enabled', [
            'auth_bearer' => $this->token,
        ]);

        self::assertResponseIsSuccessful();
        self::assertJsonContains([
            'id' => 'community_plugins_enabled',
            'value' => '0', // Default value provided by SystemSettingProvider
        ]);
    }

    public function testGetSystemSettingNotFound(): void
    {
        static::createClient()->request('GET', '/api/system_settings/non_existent_key', [
            'auth_bearer' => $this->token,
        ]);

        self::assertResponseStatusCodeSame(404);
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

    public function testUpsertSystemSettingAsAdmin(): void
    {
        // Ensure setting does NOT exist in DB initially
        $this->ensureSettingDoesNotExist('community_plugins_enabled');

        $adminToken = $this->getAdminToken();

        // Perform PUT request (Upsert)
        static::createClient()->request('PUT', '/api/system_settings/community_plugins_enabled', [
            'auth_bearer' => $adminToken,
            'json' => ['value' => '1'],
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
        $conn = $this->getEntityManager()->getConnection();
        $count = $conn->fetchOne('SELECT COUNT(*) FROM system_setting WHERE id = ?', [$id]);

        if ($count > 0) {
            $conn->executeStatement('UPDATE system_setting SET value = ? WHERE id = ?', [$value, $id]);
        } else {
            $conn->executeStatement('INSERT INTO system_setting (id, value) VALUES (?, ?)', [$id, $value]);
        }
    }

    private function ensureSettingDoesNotExist(string $id): void
    {
        $this->getEntityManager()->getConnection()->executeStatement(
            'DELETE FROM system_setting WHERE id = ?',
            [$id]
        );
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
