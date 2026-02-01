<?php

namespace Ari\Tests\Unit\Service\Marketplace;

use Ari\Service\Marketplace\PluginValidationException;
use Ari\Service\Marketplace\PluginValidatorService;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\TestCase;

#[CoversClass(PluginValidatorService::class)]
class PluginValidatorServiceTest extends TestCase
{
    private PluginValidatorService $validator;
    private string $tempDir;

    #[\Override]
    protected function setUp(): void
    {
        $this->validator = new PluginValidatorService(50 * 1024 * 1024);
        $this->tempDir = sys_get_temp_dir() . '/plugin_validator_test_' . bin2hex(random_bytes(8));
        mkdir($this->tempDir, 0o777, true);
    }

    #[\Override]
    protected function tearDown(): void
    {
        $this->removeDir($this->tempDir);
    }

    public function testValidateArchiveTooLarge(): void
    {
        $validator = new PluginValidatorService(100); // 100 bytes max

        $zipPath = $this->createMinimalZip();

        $this->expectException(PluginValidationException::class);
        $this->expectExceptionMessage('Plugin archive too large');

        $validator->validateArchive($zipPath);
    }

    public function testValidateArchiveInvalidZip(): void
    {
        $zipPath = $this->tempDir . '/invalid.zip';
        file_put_contents($zipPath, 'not a zip');

        $this->expectException(PluginValidationException::class);
        $this->expectExceptionMessage('Unable to open plugin archive');

        $this->validator->validateArchive($zipPath);
    }

    public function testValidateArchivePathTraversal(): void
    {
        $zipPath = $this->tempDir . '/traversal.zip';
        $zip = new \ZipArchive();
        $zip->open($zipPath, \ZipArchive::CREATE);
        $zip->addFromString('../etc/passwd', 'malicious');
        $zip->close();

        $this->expectException(PluginValidationException::class);
        $this->expectExceptionMessage('Archive contains path traversal');

        $this->validator->validateArchive($zipPath);
    }

    public function testValidateArchiveAbsolutePaths(): void
    {
        $zipPath = $this->tempDir . '/absolute.zip';
        $zip = new \ZipArchive();
        $zip->open($zipPath, \ZipArchive::CREATE);
        $zip->addFromString('/etc/passwd', 'malicious');
        $zip->close();

        $this->expectException(PluginValidationException::class);
        $this->expectExceptionMessage('Archive contains absolute paths');

        $this->validator->validateArchive($zipPath);
    }

    public function testValidateArchiveValid(): void
    {
        $this->expectNotToPerformAssertions();

        $zipPath = $this->createMinimalZip();
        $this->validator->validateArchive($zipPath);
    }

    public function testValidateMissingManifest(): void
    {
        $pluginDir = $this->tempDir . '/plugin';
        mkdir($pluginDir);
        file_put_contents($pluginDir . '/src/Bundle.php', '<?php');

        $this->expectException(PluginValidationException::class);
        $this->expectExceptionMessage('Missing plugin manifest');

        $this->validator->validate($pluginDir, 'test-plugin');
    }

    public function testValidateInvalidJson(): void
    {
        $pluginDir = $this->tempDir . '/plugin';
        mkdir($pluginDir);
        file_put_contents($pluginDir . '/plugin.json', '{invalid json');

        $this->expectException(PluginValidationException::class);
        $this->expectExceptionMessage('malformed JSON');

        $this->validator->validate($pluginDir, 'test-plugin');
    }

    public function testValidateMissingNameField(): void
    {
        $pluginDir = $this->createPluginDir(['version' => '1.0.0']);

        $this->expectException(PluginValidationException::class);
        $this->expectExceptionMessage('missing "name" field');

        $this->validator->validate($pluginDir, 'test-plugin');
    }

    public function testValidateMissingVersionField(): void
    {
        $pluginDir = $this->createPluginDir(['name' => 'test-plugin']);

        $this->expectException(PluginValidationException::class);
        $this->expectExceptionMessage('missing "version" field');

        $this->validator->validate($pluginDir, 'test-plugin');
    }

    public function testValidatePluginIdMismatch(): void
    {
        $pluginDir = $this->createPluginDir([
            'name' => 'wrong-plugin',
            'version' => '1.0.0',
        ]);

        $this->expectException(PluginValidationException::class);
        $this->expectExceptionMessage('Plugin ID mismatch');

        $this->validator->validate($pluginDir, 'test-plugin');
    }

    public function testValidateCoreIncompatible(): void
    {
        $pluginDir = $this->createPluginDir([
            'name' => 'test-plugin',
            'version' => '1.0.0',
            'require' => ['ari/core' => '^99.0.0'],
        ]);

        $this->expectException(PluginValidationException::class);
        $this->expectExceptionMessage('Incompatible with current Ari version');

        $this->validator->validate($pluginDir, 'test-plugin');
    }

    public function testValidateCoreCompatible(): void
    {
        $this->expectNotToPerformAssertions();

        $pluginDir = $this->createPluginDir([
            'name' => 'test-plugin',
            'version' => '1.0.0',
            'require' => ['ari/core' => '^0.1.0'],
        ]);

        $this->validator->validate($pluginDir, 'test-plugin');
    }

    public function testValidateBackendBundleMissing(): void
    {
        $pluginDir = $this->createPluginDir([
            'name' => 'test-plugin',
            'version' => '1.0.0',
            'backend' => [
                'enabled' => true,
                'bundle' => 'Plugins\\TestPlugin\\TestPlugin',
            ],
        ]);

        $this->expectException(PluginValidationException::class);
        $this->expectExceptionMessage('Backend bundle class not found');

        $this->validator->validate($pluginDir, 'test-plugin');
    }

    public function testValidateBackendBundleExists(): void
    {
        $this->expectNotToPerformAssertions();

        $pluginDir = $this->createPluginDir([
            'name' => 'test-plugin',
            'version' => '1.0.0',
            'backend' => [
                'enabled' => true,
                'bundle' => 'Plugins\\TestPlugin\\TestPlugin',
            ],
        ]);

        mkdir($pluginDir . '/src', 0o777, true);
        file_put_contents($pluginDir . '/src/TestPlugin.php', '<?php');

        $this->validator->validate($pluginDir, 'test-plugin');
    }

    public function testValidateBackendDisabledSkipsCheck(): void
    {
        $this->expectNotToPerformAssertions();

        $pluginDir = $this->createPluginDir([
            'name' => 'test-plugin',
            'version' => '1.0.0',
            'backend' => [
                'enabled' => false,
                'bundle' => 'Plugins\\TestPlugin\\TestPlugin',
            ],
        ]);

        $this->validator->validate($pluginDir, 'test-plugin');
    }

    public function testValidateFrontendEntryMissing(): void
    {
        $pluginDir = $this->createPluginDir([
            'name' => 'test-plugin',
            'version' => '1.0.0',
            'frontend' => [
                'enabled' => true,
                'entry' => 'ui/dist/main.js',
            ],
        ]);

        $this->expectException(PluginValidationException::class);
        $this->expectExceptionMessage('Frontend entry file not found');

        $this->validator->validate($pluginDir, 'test-plugin');
    }

    public function testValidateFrontendEntryExists(): void
    {
        $this->expectNotToPerformAssertions();

        $pluginDir = $this->createPluginDir([
            'name' => 'test-plugin',
            'version' => '1.0.0',
            'frontend' => [
                'enabled' => true,
                'entry' => 'ui/dist/main.js',
            ],
        ]);

        mkdir($pluginDir . '/ui/dist', 0o777, true);
        file_put_contents($pluginDir . '/ui/dist/main.js', 'console.log("hi")');

        $this->validator->validate($pluginDir, 'test-plugin');
    }

    public function testValidateFrontendDisabledSkipsCheck(): void
    {
        $this->expectNotToPerformAssertions();

        $pluginDir = $this->createPluginDir([
            'name' => 'test-plugin',
            'version' => '1.0.0',
            'frontend' => [
                'enabled' => false,
                'entry' => 'ui/dist/main.js',
            ],
        ]);

        $this->validator->validate($pluginDir, 'test-plugin');
    }

    public function testLoadManifest(): void
    {
        $pluginDir = $this->createPluginDir([
            'name' => 'test-plugin',
            'version' => '1.0.0',
        ]);

        $manifest = $this->validator->loadManifest($pluginDir);

        self::assertEquals('test-plugin', $manifest['name']);
        self::assertEquals('1.0.0', $manifest['version']);
    }

    public function testLoadManifestNonArrayJson(): void
    {
        $pluginDir = $this->tempDir . '/plugin_scalar';
        mkdir($pluginDir);
        file_put_contents($pluginDir . '/plugin.json', '"just a string"');

        $this->expectException(PluginValidationException::class);
        $this->expectExceptionMessage('expected JSON object');

        $this->validator->loadManifest($pluginDir);
    }

    /**
     * @param array<string, mixed> $manifest
     */
    private function createPluginDir(array $manifest): string
    {
        $dir = $this->tempDir . '/plugin_' . bin2hex(random_bytes(4));
        mkdir($dir, 0o777, true);
        file_put_contents($dir . '/plugin.json', json_encode($manifest, JSON_THROW_ON_ERROR));

        return $dir;
    }

    private function createMinimalZip(): string
    {
        $zipPath = $this->tempDir . '/plugin.zip';
        $zip = new \ZipArchive();
        $zip->open($zipPath, \ZipArchive::CREATE);
        $zip->addFromString('plugin.json', '{"name":"test","version":"1.0.0"}');
        $zip->close();

        return $zipPath;
    }

    private function removeDir(string $dir): void
    {
        if (!is_dir($dir)) {
            return;
        }

        $items = new \RecursiveIteratorIterator(
            new \RecursiveDirectoryIterator($dir, \RecursiveDirectoryIterator::SKIP_DOTS),
            \RecursiveIteratorIterator::CHILD_FIRST,
        );

        foreach ($items as $item) {
            if ($item->isDir()) {
                rmdir($item->getRealPath());
            } else {
                unlink($item->getRealPath());
            }
        }

        rmdir($dir);
    }
}
