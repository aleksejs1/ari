<?php

namespace Ari\Tests\Functional;

use Ari\Entity\SystemSetting;
use Ari\Entity\UserPlugin;
use Symfony\Component\Filesystem\Filesystem;

class UserPluginTest extends AbstractApiTestCase
{
    private const PLUGIN_ID = 'test-user-plugin';

    #[\Override]
    protected function setUp(): void
    {
        parent::setUp();
        // Create dummy plugin
        $fs = new Filesystem();
        $projectDir = self::getContainer()->getParameter('kernel.project_dir');
        assert(is_string($projectDir));
        $targetDir = $projectDir . '/plugins/' . self::PLUGIN_ID;
        $fs->mkdir($targetDir);
        file_put_contents($targetDir . '/plugin.json', json_encode([
            'name' => self::PLUGIN_ID,
            'version' => '1.0.0',
            'frontend' => [
                'enabled' => true,
                'entry' => 'index.js'
            ]
        ], JSON_THROW_ON_ERROR));

        $this->ensureGlobalSettingEnabled();
    }

    #[\Override]
    protected function tearDown(): void
    {
        // Cleanup
        $fs = new Filesystem();
        $projectDir = self::getContainer()->getParameter('kernel.project_dir');
        assert(is_string($projectDir));
        $targetDir = $projectDir . '/plugins/' . self::PLUGIN_ID;
        $fs->remove($targetDir);
        parent::tearDown();
    }

    public function testActivatePlugin(): void
    {
        // Make sure it doesn't default to active?
        // By default no record exists.

        static::createClient()->request('POST', '/api/user-plugins/activate', [
            'auth_bearer' => $this->token,
            'json' => ['pluginId' => self::PLUGIN_ID],
        ]);

        self::assertResponseIsSuccessful();

        // Verify DB
        $em = $this->getEntityManager();
        $em->clear();
        $plugin = $em->getRepository(UserPlugin::class)->findOneBy(['pluginId' => self::PLUGIN_ID]);
        self::assertNotNull($plugin);
        self::assertTrue($plugin->isEnabled());
        $tenant = $plugin->getTenant();
        self::assertNotNull($tenant);
        self::assertEquals('test@example.com', $tenant->getUserIdentifier());
    }

    public function testDeactivatePlugin(): void
    {
        // Activate first
        $this->testActivatePlugin();

        static::createClient()->request('POST', '/api/user-plugins/deactivate', [
            'auth_bearer' => $this->token,
            'json' => ['pluginId' => self::PLUGIN_ID],
        ]);

        self::assertResponseIsSuccessful();

        $em = $this->getEntityManager();
        $em->clear();
        $plugin = $em->getRepository(UserPlugin::class)->findOneBy(['pluginId' => self::PLUGIN_ID]);
        self::assertNotNull($plugin);
        self::assertFalse($plugin->isEnabled());
    }

    public function testListUserPlugins(): void
    {
        $this->testActivatePlugin();

        $response = static::createClient()->request('GET', '/api/user-plugins', [
            'auth_bearer' => $this->token,
        ]);

        self::assertResponseIsSuccessful();
        $data = $response->toArray();

        $found = false;
        foreach ($data as $p) {
            if ($p['pluginId'] === self::PLUGIN_ID) {
                self::assertTrue($p['enabled']);
                $found = true;
                break;
            }
        }
        self::assertTrue($found);
    }

    public function testAvailablePlugins(): void
    {
        // 1. Check BEFORE activation
        $response = static::createClient()->request('GET', '/api/user-plugins/available', [
            'auth_bearer' => $this->token,
        ]);
        self::assertResponseIsSuccessful();
        $data = $response->toArray();

        $target = null;
        foreach ($data as $p) {
            if (($p['pluginId'] ?? $p['name']) === self::PLUGIN_ID) {
                $target = $p;
                break;
            }
        }

        self::assertNotNull($target, 'Plugin should be in available list');
        self::assertFalse($target['enabled'], 'Should be disabled initially');
        self::assertEquals('1.0.0', $target['version']);

        // 2. Activate
        $this->testActivatePlugin();

        // 3. Check AFTER activation
        $response = static::createClient()->request('GET', '/api/user-plugins/available', [
            'auth_bearer' => $this->token,
        ]);
        self::assertResponseIsSuccessful();
        $data = $response->toArray();

        $target = null;
        foreach ($data as $p) {
            if (($p['pluginId'] ?? $p['name']) === self::PLUGIN_ID) {
                $target = $p;
                break;
            }
        }

        self::assertNotNull($target);
        self::assertTrue($target['enabled'], 'Should be enabled after activation');
    }

    public function testPluginListFiltering(): void
    {
        // 1. Initially (before activation), list should NOT contain test plugin
        $response = static::createClient()->request('GET', '/api/plugins', [
            'auth_bearer' => $this->token,
        ]);
        self::assertResponseIsSuccessful();
        $data = $response->toArray();

        // PluginList serialization structure: "plugins" key?
        // Or if simple provider return, normalized object.
        // Assuming { plugins: [...] }
        $list = $data['plugins'] ?? [];

        $found = false;
        foreach ($list as $p) {
            if (($p['id'] ?? '') === self::PLUGIN_ID) {
                $found = true;
                break;
            }
        }
        self::assertFalse($found, 'Plugin should not be listed before activation');

        // 2. Activate
        $this->testActivatePlugin();

        // 3. Check list again
        $response = static::createClient()->request('GET', '/api/plugins', [
            'auth_bearer' => $this->token,
        ]);
        $data = $response->toArray();
        $list = $data['plugins'] ?? [];

        $found = false;
        foreach ($list as $p) {
            if (($p['id'] ?? '') === self::PLUGIN_ID) {
                $found = true;
                self::assertTrue($p['enabled']);
                break;
            }
        }
        self::assertTrue($found, 'Plugin should be listed after activation');
    }

    public function testActivateNonExistentPlugin(): void
    {
        static::createClient()->request('POST', '/api/user-plugins/activate', [
            'auth_bearer' => $this->token,
            'json' => ['pluginId' => 'non-existent-plugin-123'],
        ]);

        self::assertResponseStatusCodeSame(404);
    }

    public function testActivatePluginWithMismatchedDirectory(): void
    {
        // 1. Setup: Create plugin with ID 'mismatched-id' in directory 'random-dir-name'
        $fs = new Filesystem();
        $projectDir = self::getContainer()->getParameter('kernel.project_dir');
        assert(is_string($projectDir));
        $targetDir = $projectDir . '/plugins/random-dir-name';
        $fs->mkdir($targetDir);
        $pluginId = 'mismatched-id';

        try {
            file_put_contents($targetDir . '/plugin.json', json_encode([
                'name' => $pluginId,
                'version' => '1.0.0',
            ], JSON_THROW_ON_ERROR));

            // 2. Activate using the ID (not dir name)
            static::createClient()->request('POST', '/api/user-plugins/activate', [
                'auth_bearer' => $this->token,
                'json' => ['pluginId' => $pluginId],
            ]);

            self::assertResponseIsSuccessful();

            // 3. Verify DB
            $em = $this->getEntityManager();
            $em->clear();
            $plugin = $em->getRepository(UserPlugin::class)->findOneBy(['pluginId' => $pluginId]);
            self::assertNotNull($plugin);
            self::assertTrue($plugin->isEnabled());
        } finally {
            $fs->remove($targetDir);
        }
    }

    private function ensureGlobalSettingEnabled(): void
    {
        $em = $this->getEntityManager();
        $setting = $em->find(SystemSetting::class, 'community_plugins_enabled');
        if ($setting === null) {
            $setting = new SystemSetting();
            $setting->setId('community_plugins_enabled');
            $setting->setValue('1');
            $em->persist($setting);
        } else {
            $setting->setValue('1');
        }
        $em->flush();
    }
}
