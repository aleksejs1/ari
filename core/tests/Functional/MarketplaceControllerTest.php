<?php

namespace Ari\Tests\Functional;

use Ari\Entity\UserPref;

class MarketplaceControllerTest extends AbstractApiTestCase
{
    public function testRegistryUnauthenticated(): void
    {
        static::createClient()->request('GET', '/api/marketplace/registry');
        self::assertResponseStatusCodeSame(401);
    }

    public function testRegistryWithCommunityPluginsDisabled(): void
    {
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
        static::createClient()->request('GET', '/api/marketplace/readme/test-plugin', [
            'auth_bearer' => $this->token,
        ]);

        self::assertResponseStatusCodeSame(403);
    }

    public function testInstallWithCommunityPluginsDisabled(): void
    {
        static::createClient()->request('POST', '/api/marketplace/install', [
            'auth_bearer' => $this->token,
            'json' => ['pluginId' => 'test-plugin'],
        ]);

        self::assertResponseStatusCodeSame(403);
    }

    public function testUpdateWithCommunityPluginsDisabled(): void
    {
        static::createClient()->request('POST', '/api/marketplace/update', [
            'auth_bearer' => $this->token,
            'json' => ['pluginId' => 'test-plugin'],
        ]);

        self::assertResponseStatusCodeSame(403);
    }

    public function testUninstallWithCommunityPluginsDisabled(): void
    {
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

    private function enableCommunityPlugins(): void
    {
        $em = $this->getEntityManager();
        $user = $em->getRepository(\Ari\Entity\User::class)->findOneBy(['uuid' => 'test@example.com']);
        self::assertNotNull($user);

        $pref = new UserPref();
        $pref->setUser($user);
        $pref->setTenant($user);
        $pref->setType(UserPref::TYPE_COMMUNITY_PLUGINS_ENABLED);
        $pref->setValue('1');

        $em->persist($pref);
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
