<?php

namespace Ari\Tests\Functional;

class MarketplaceControllerTest extends AbstractApiTestCase
{
    public function testRegistryUnauthenticated(): void
    {
        static::createClient()->request('GET', '/api/marketplace/registry');
        self::assertResponseStatusCodeSame(401);
    }

    public function testRegistryWithCommunityPluginsDisabled(): void
    {
        $this->disableCommunityPlugins();

        $client = static::createClient();
        $response = $client->request('GET', '/api/marketplace/registry', [
            'auth_bearer' => $this->token,
        ]);

        self::assertResponseIsSuccessful();

        $data = $response->toArray();
        self::assertFalse($data['enabled']);
        self::assertEmpty($data['plugins']);
    }

    public function testReadmeWithCommunityPluginsDisabled(): void
    {
        $this->disableCommunityPlugins();

        static::createClient()->request('GET', '/api/marketplace/readme/test-plugin', [
            'auth_bearer' => $this->token,
        ]);

        self::assertResponseStatusCodeSame(403);
    }

    public function testInstallWithCommunityPluginsDisabled(): void
    {
        $this->disableCommunityPlugins();

        static::createClient()->request('POST', '/api/marketplace/install', [
            'auth_bearer' => $this->token,
            'json' => ['pluginId' => 'test-plugin'],
        ]);

        self::assertResponseStatusCodeSame(403);
    }

    public function testUpdateWithCommunityPluginsDisabled(): void
    {
        $this->disableCommunityPlugins();

        static::createClient()->request('POST', '/api/marketplace/update', [
            'auth_bearer' => $this->token,
            'json' => ['pluginId' => 'test-plugin'],
        ]);

        self::assertResponseStatusCodeSame(403);
    }

    public function testUninstallWithCommunityPluginsDisabled(): void
    {
        $this->disableCommunityPlugins();

        static::createClient()->request('POST', '/api/marketplace/uninstall', [
            'auth_bearer' => $this->token,
            'json' => ['pluginId' => 'test-plugin'],
        ]);

        self::assertResponseStatusCodeSame(403);
    }

    public function testInstallMissingPluginId(): void
    {
        $this->enableCommunityPlugins();
        $this->promoteUserToAdmin();

        static::createClient()->request('POST', '/api/marketplace/install', [
            'auth_bearer' => $this->token,
            'json' => [],
        ]);

        self::assertResponseStatusCodeSame(404);
    }

    public function testUpdateMissingPluginId(): void
    {
        $this->enableCommunityPlugins();
        $this->promoteUserToAdmin();

        static::createClient()->request('POST', '/api/marketplace/update', [
            'auth_bearer' => $this->token,
            'json' => [],
        ]);

        self::assertResponseStatusCodeSame(404);
    }

    public function testUninstallMissingPluginId(): void
    {
        $this->enableCommunityPlugins();
        $this->promoteUserToAdmin();

        static::createClient()->request('POST', '/api/marketplace/uninstall', [
            'auth_bearer' => $this->token,
            'json' => [],
        ]);

        self::assertResponseStatusCodeSame(404);
    }

    public function testInstallDeniedForNonAdmin(): void
    {
        $this->enableCommunityPlugins();
        // User is missing ROLE_ADMIN

        static::createClient()->request('POST', '/api/marketplace/install', [
            'auth_bearer' => $this->token,
            'json' => ['pluginId' => 'gift-plugin'],
        ]);

        self::assertResponseStatusCodeSame(403);
    }

    public function testUpdateDeniedForNonAdmin(): void
    {
        $this->enableCommunityPlugins();

        static::createClient()->request('POST', '/api/marketplace/update', [
            'auth_bearer' => $this->token,
            'json' => ['pluginId' => 'gift-plugin'],
        ]);

        self::assertResponseStatusCodeSame(403);
    }

    public function testUninstallDeniedForNonAdmin(): void
    {
        $this->enableCommunityPlugins();

        static::createClient()->request('POST', '/api/marketplace/uninstall', [
            'auth_bearer' => $this->token,
            'json' => ['pluginId' => 'gift-plugin'],
        ]);

        self::assertResponseStatusCodeSame(403);
    }

    public function testUninstallCascades(): void
    {
        $this->enableCommunityPlugins();
        $this->promoteUserToAdmin();

        // 1. Create UserPlugin
        $em = $this->getEntityManager();
        $user = $em->getRepository(\Ari\Entity\User::class)->findOneBy(['uuid' => 'test@example.com']);
        $plugin = new \Ari\Entity\UserPlugin();
        $plugin->setTenant($user);
        $plugin->setPluginId('test-plugin');
        $em->persist($plugin);
        $em->flush();

        // 2. Mock Service
        $mockService = $this->createMock(\Ari\Service\Marketplace\PluginMarketplaceService::class);
        $mockService->method('isCommunityPluginsEnabled')->willReturn(true);
        $mockService->expects($this->once())
            ->method('uninstallPlugin')
            ->with('test-plugin')
            ->willReturn(['success' => true]);

        $client = static::createClient();
        $client->disableReboot();
        $client->getContainer()->set(\Ari\Service\Marketplace\PluginMarketplaceService::class, $mockService);

        $client->request('POST', '/api/marketplace/uninstall', [
            'auth_bearer' => $this->token,
            'json' => ['pluginId' => 'test-plugin'],
        ]);

        self::assertResponseIsSuccessful();

        // 3. Verify UserPlugin is gone
        $em->clear();
        $deletedPlugin = $em->getRepository(\Ari\Entity\UserPlugin::class)->findOneBy(['pluginId' => 'test-plugin']);
        self::assertNull($deletedPlugin);
    }

    private function enableCommunityPlugins(): void
    {
        $em = $this->getEntityManager();

        $setting = $em->find(\Ari\Entity\SystemSetting::class, 'community_plugins_enabled');
        if ($setting === null) {
            $setting = new \Ari\Entity\SystemSetting();
            $setting->setId('community_plugins_enabled');
            $setting->setValue('1');
            $em->persist($setting);
        } else {
            $setting->setValue('1');
        }

        $em->flush();
    }

    private function disableCommunityPlugins(): void
    {
        $em = $this->getEntityManager();

        $setting = $em->find(\Ari\Entity\SystemSetting::class, 'community_plugins_enabled');
        if ($setting === null) {
            $setting = new \Ari\Entity\SystemSetting();
            $setting->setId('community_plugins_enabled');
            $setting->setValue('0');
            $em->persist($setting);
        } else {
            $setting->setValue('0');
        }

        $em->flush();
    }

    private function promoteUserToAdmin(): void
    {
        $em = $this->getEntityManager();
        $user = $em->getRepository(\Ari\Entity\User::class)->findOneBy(['uuid' => 'test@example.com']);
        self::assertNotNull($user);

        $user->setRoles(['ROLE_ADMIN']);
        $em->persist($user);
        $em->flush();
    }
}
