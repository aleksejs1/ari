<?php

namespace Ari\Tests\Unit\Service;

use Ari\Exception\SmsBackupParseException;
use Ari\Service\SmsBackupParserService;
use Ari\ValueObject\ParsedRecord;
use PHPUnit\Framework\TestCase;

final class SmsBackupParserServiceTest extends TestCase
{
    private SmsBackupParserService $parser;
    private string $tempDir;

    #[\Override]
    protected function setUp(): void
    {
        $this->tempDir = sys_get_temp_dir();
        $this->parser = new SmsBackupParserService($this->tempDir);
    }

    // ── Helper ──────────────────────────────────────────────────────────────

    private function writeTempXml(string $content): string
    {
        $path = tempnam($this->tempDir, 'sms_parser_test_');
        self::assertIsString($path);
        file_put_contents($path, $content);

        return $path;
    }

    // ── SMS happy path ───────────────────────────────────────────────────────

    public function testParseSmsFile(): void
    {
        $xml = <<<'XML'
            <?xml version="1.0" encoding="UTF-8"?>
            <smses count="2">
              <sms address="+37129837434" type="1" date="1672531200000" contact_name="Alice" body="Hello" />
              <sms address="+37129837435" type="2" date="1672617600000" contact_name="Bob" body="Hi" />
            </smses>
            XML;

        $path = $this->writeTempXml($xml);
        try {
            $records = $this->parser->parse($path);
        } finally {
            unlink($path);
        }

        self::assertCount(2, $records);

        $r0 = $records[0];
        self::assertSame(ParsedRecord::TYPE_SMS, $r0->type);
        self::assertSame('+37129837434', $r0->phoneNumber);
        self::assertSame('37129837434', $r0->normalizedPhone);
        self::assertSame('Alice', $r0->contactName);
        self::assertSame('incoming', $r0->direction);

        $r1 = $records[1];
        self::assertSame('outgoing', $r1->direction);
        self::assertSame('Bob', $r1->contactName);
    }

    // ── Calls happy path ─────────────────────────────────────────────────────

    public function testParseCallsFile(): void
    {
        $xml = <<<'XML'
            <?xml version="1.0" encoding="UTF-8"?>
            <calls count="4">
              <call number="+37129000001" type="1" date="1672531200000" duration="36" contact_name="Alice" />
              <call number="+37129000002" type="2" date="1672617600000" duration="120" contact_name="Bob" />
              <call number="+37129000003" type="3" date="1672704000000" duration="0" contact_name="Carol" />
              <call number="+37129000004" type="5" date="1672790400000" duration="0" contact_name="Dave" />
            </calls>
            XML;

        $path = $this->writeTempXml($xml);
        try {
            $records = $this->parser->parse($path);
        } finally {
            unlink($path);
        }

        self::assertCount(4, $records);
        $r0 = $records[0];
        $r1 = $records[1];
        $r2 = $records[2];
        $r3 = $records[3];

        self::assertSame(ParsedRecord::TYPE_CALL, $r0->type);
        self::assertSame('incoming', $r0->direction);
        self::assertSame(36, $r0->durationSeconds);

        self::assertSame('outgoing', $r1->direction);
        self::assertSame(120, $r1->durationSeconds);

        self::assertSame('missed', $r2->direction);
        self::assertNull($r2->durationSeconds); // duration=0 → null

        self::assertSame('rejected', $r3->direction);
    }

    // ── Empty file ───────────────────────────────────────────────────────────

    public function testEmptySmsFileReturnsNoRecords(): void
    {
        $xml = '<?xml version="1.0" encoding="UTF-8"?><smses count="0"></smses>';
        $path = $this->writeTempXml($xml);
        try {
            $records = $this->parser->parse($path);
        } finally {
            unlink($path);
        }

        self::assertSame([], $records);
    }

    // ── Malformed XML ────────────────────────────────────────────────────────

    public function testMalformedXmlThrows(): void
    {
        $path = $this->writeTempXml('<?xml version="1.0"?><smses><sms unclosed');
        try {
            $this->expectException(SmsBackupParseException::class);
            $this->parser->parse($path);
        } finally {
            unlink($path);
        }
    }

    // ── Wrong root element ───────────────────────────────────────────────────

    public function testWrongRootElementThrows(): void
    {
        $xml = '<?xml version="1.0" encoding="UTF-8"?><contacts><contact /></contacts>';
        $path = $this->writeTempXml($xml);
        try {
            $this->expectException(SmsBackupParseException::class);
            $this->expectExceptionMessageMatches('/root element/');
            $this->parser->parse($path);
        } finally {
            unlink($path);
        }
    }

    // ── SMS with empty address skipped ───────────────────────────────────────

    public function testSmsWithEmptyAddressIsSkipped(): void
    {
        $xml = <<<'XML'
            <?xml version="1.0" encoding="UTF-8"?>
            <smses count="2">
              <sms address="" type="1" date="1672531200000" contact_name="" body="" />
              <sms address="+37129837434" type="1" date="1672531200000" contact_name="Alice" body="Hi" />
            </smses>
            XML;

        $path = $this->writeTempXml($xml);
        try {
            $records = $this->parser->parse($path);
        } finally {
            unlink($path);
        }

        self::assertCount(1, $records);
        self::assertSame('+37129837434', $records[0]->phoneNumber);
    }

    // ── Unknown elements are silently skipped ────────────────────────────────

    public function testUnknownElementsInsideSmsesAreSkipped(): void
    {
        $xml = <<<'XML'
            <?xml version="1.0" encoding="UTF-8"?>
            <smses count="1">
              <mms address="+1111" date="1672531200000" />
              <sms address="+37129837434" type="1" date="1672531200000" contact_name="Alice" body="Hi" />
            </smses>
            XML;

        $path = $this->writeTempXml($xml);
        try {
            $records = $this->parser->parse($path);
        } finally {
            unlink($path);
        }

        self::assertCount(1, $records);
        self::assertSame(ParsedRecord::TYPE_SMS, $records[0]->type);
    }

    // ── Phone normalisation ──────────────────────────────────────────────────

    public function testPhoneNormalization(): void
    {
        $xml = <<<'XML'
            <?xml version="1.0" encoding="UTF-8"?>
            <smses count="1">
              <sms address="+371 29 837 434" type="1" date="1672531200000" contact_name="Alice" body="Hi" />
            </smses>
            XML;

        $path = $this->writeTempXml($xml);
        try {
            $records = $this->parser->parse($path);
        } finally {
            unlink($path);
        }

        self::assertCount(1, $records);
        self::assertSame('37129837434', $records[0]->normalizedPhone);
    }

    // ── Path outside allowed dir throws ─────────────────────────────────────

    public function testFileOutsideAllowedDirThrows(): void
    {
        $this->expectException(SmsBackupParseException::class);
        $this->expectExceptionMessageMatches('/allowed directory/');
        $this->parser->parse('/etc/passwd');
    }

    // ── Non-existent file throws ─────────────────────────────────────────────

    public function testNonExistentFileThrows(): void
    {
        $this->expectException(SmsBackupParseException::class);
        $this->parser->parse($this->tempDir . '/does_not_exist_' . uniqid() . '.xml');
    }
}
