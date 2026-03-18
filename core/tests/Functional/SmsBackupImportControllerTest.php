<?php

namespace Ari\Tests\Functional;

use Symfony\Component\HttpFoundation\File\UploadedFile;

final class SmsBackupImportControllerTest extends AbstractApiTestCase
{
    /** @var list<string> */
    private array $tempFiles = [];

    #[\Override]
    protected function tearDown(): void
    {
        foreach ($this->tempFiles as $path) {
            if (file_exists($path)) {
                unlink($path);
            }
        }
        $this->tempFiles = [];
        parent::tearDown();
    }

    // ── Fixtures ─────────────────────────────────────────────────────────────

    private function makeSmsXml(): string
    {
        return <<<'XML'
            <?xml version="1.0" encoding="UTF-8"?>
            <smses count="1">
              <sms address="+37129837434" type="1" date="1672531200000" contact_name="Alice" body="Hello" />
            </smses>
            XML;
    }

    private function makeCallsXml(): string
    {
        return <<<'XML'
            <?xml version="1.0" encoding="UTF-8"?>
            <calls count="1">
              <call number="+37129837434" type="1" date="1672531200000" duration="36" contact_name="Alice" />
            </calls>
            XML;
    }

    private function writeTempXml(string $content, string $filename): string
    {
        $path = sys_get_temp_dir() . '/' . $filename;
        file_put_contents($path, $content);
        $this->tempFiles[] = $path;

        return $path;
    }

    private function makeUploadedFile(string $content, string $filename): UploadedFile
    {
        $path = $this->writeTempXml($content, $filename);

        return new UploadedFile($path, $filename, 'application/xml', null, true);
    }

    // ── Happy paths ───────────────────────────────────────────────────────────

    public function testImportSmsFileReturns202(): void
    {
        $client = static::createClient();
        $file = $this->makeUploadedFile($this->makeSmsXml(), 'sms-test.xml');

        $client->request('POST', '/api/sms_backup/import', [
            'headers' => ['Authorization' => 'Bearer ' . $this->token],
            'extra' => ['files' => ['files' => [$file]]],
        ]);

        self::assertResponseStatusCodeSame(202);
        self::assertJsonContains(['status' => 'queued']);
    }

    public function testImportCallsFileReturns202(): void
    {
        $client = static::createClient();
        $file = $this->makeUploadedFile($this->makeCallsXml(), 'calls-test.xml');

        $client->request('POST', '/api/sms_backup/import', [
            'headers' => ['Authorization' => 'Bearer ' . $this->token],
            'extra' => ['files' => ['files' => [$file]]],
        ]);

        self::assertResponseStatusCodeSame(202);
    }

    public function testImportBothFilesSimultaneouslyReturns202(): void
    {
        $client = static::createClient();
        $smsFile = $this->makeUploadedFile($this->makeSmsXml(), 'sms-both.xml');
        $callsFile = $this->makeUploadedFile($this->makeCallsXml(), 'calls-both.xml');

        $client->request('POST', '/api/sms_backup/import', [
            'headers' => ['Authorization' => 'Bearer ' . $this->token],
            'extra' => ['files' => ['files' => [$smsFile, $callsFile]]],
        ]);

        self::assertResponseStatusCodeSame(202);
    }

    // ── Authentication ────────────────────────────────────────────────────────

    public function testUnauthenticatedReturns401(): void
    {
        $client = static::createClient();

        // No auth header — 401 is returned before any file is processed.
        $client->request('POST', '/api/sms_backup/import');

        self::assertResponseStatusCodeSame(401);
    }

    // ── Validation errors ─────────────────────────────────────────────────────

    public function testNoFileReturns422(): void
    {
        $client = static::createClient();

        $client->request('POST', '/api/sms_backup/import', [
            'headers' => ['Authorization' => 'Bearer ' . $this->token],
        ]);

        self::assertResponseStatusCodeSame(422);
        self::assertJsonContains(['detail' => 'At least one XML file is required.']);
    }

    public function testInvalidXmlReturns422(): void
    {
        $client = static::createClient();
        $file = $this->makeUploadedFile('not valid xml <<<', 'bad.xml');

        $client->request('POST', '/api/sms_backup/import', [
            'headers' => ['Authorization' => 'Bearer ' . $this->token],
            'extra' => ['files' => ['files' => [$file]]],
        ]);

        self::assertResponseStatusCodeSame(422);
    }

    public function testWrongRootElementReturns422(): void
    {
        $client = static::createClient();
        $file = $this->makeUploadedFile(
            '<?xml version="1.0"?><contacts><contact /></contacts>',
            'wrong.xml',
        );

        $client->request('POST', '/api/sms_backup/import', [
            'headers' => ['Authorization' => 'Bearer ' . $this->token],
            'extra' => ['files' => ['files' => [$file]]],
        ]);

        self::assertResponseStatusCodeSame(422);
    }

    public function testInvalidUnknownNumbersOptionReturns422(): void
    {
        $client = static::createClient();
        $file = $this->makeUploadedFile($this->makeSmsXml(), 'sms-opt.xml');

        $client->request('POST', '/api/sms_backup/import', [
            'headers' => ['Authorization' => 'Bearer ' . $this->token],
            'extra' => [
                'files' => ['files' => [$file]],
                'parameters' => ['unknownNumbers' => 'banana'],
            ],
        ]);

        self::assertResponseStatusCodeSame(422);
    }

    public function testInvalidNameConflictOptionReturns422(): void
    {
        $client = static::createClient();
        $file = $this->makeUploadedFile($this->makeSmsXml(), 'sms-nc.xml');

        $client->request('POST', '/api/sms_backup/import', [
            'headers' => ['Authorization' => 'Bearer ' . $this->token],
            'extra' => [
                'files' => ['files' => [$file]],
                'parameters' => ['nameConflict' => 'invalid'],
            ],
        ]);

        self::assertResponseStatusCodeSame(422);
    }
}
