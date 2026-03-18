<?php

namespace Ari\Tests\Unit\Service;

use Ari\Dto\SmsBackupImportOptions;
use Ari\Entity\Contact;
use Ari\Entity\User;
use Ari\Repository\ContactInteractionRepository;
use Ari\Service\Entitlement\EntitlementServiceInterface;
use Ari\Service\Entitlement\EntitlementState;
use Ari\Service\SmsBackupImportService;
use Ari\ValueObject\ParsedRecord;
use Doctrine\DBAL\Connection;
use Doctrine\ORM\EntityManagerInterface;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;
use Psr\Log\NullLogger;

/**
 * Tests for the pure business logic in SmsBackupImportService:
 * SMS grouping, call type mapping, alphanumeric filtering, duplicate detection.
 *
 * All DB calls are stubbed. EntityManager::getConnection()->fetchAllAssociative()
 * is configured to return a pre-defined phone map so tests focus on
 * downstream behaviour.
 */
final class SmsBackupImportServiceTest extends TestCase
{
    private const CONTACT_ID = 42;
    private const PHONE = '+37129837434';
    private const NORMALIZED = '37129837434';

    /** @var array<array-key, int> */
    private array $phoneMap;

    private User $user;

    #[\Override]
    protected function setUp(): void
    {
        $this->user = new User();
        $this->phoneMap = [self::NORMALIZED => self::CONTACT_ID];
    }

    // ── Factory ──────────────────────────────────────────────────────────────

    /**
     * @param array<array-key, int> $phoneMap    normalizedPhone -> contactId
     * @param array<string, true>   $existingKeys pre-seeded dedup set
     */
    private function buildService(
        array $phoneMap = [],
        array $existingKeys = [],
        EntitlementState $quotaState = EntitlementState::Allowed,
    ): SmsBackupImportService {
        $rows = [];
        foreach ($phoneMap as $normalized => $id) {
            $rows[] = ['value' => (string) $normalized, 'id' => $id];
        }

        $conn = self::createStub(Connection::class);
        $conn->method('fetchAllAssociative')->willReturn($rows);

        $em = self::createStub(EntityManagerInterface::class);
        $em->method('getConnection')->willReturn($conn);
        $em->method('getReference')->willReturnCallback(
            static function (string $class, mixed $id): Contact {
                $contact = new Contact();
                // Reflect-set the id so newInteraction works without a flush.
                $ref = new \ReflectionProperty(Contact::class, 'id');
                $ref->setValue($contact, $id);

                return $contact;
            }
        );

        $interactionRepo = self::createStub(ContactInteractionRepository::class);
        $interactionRepo->method('findDeduplicationKeysByContactIds')->willReturn($existingKeys);

        $entitlements = self::createStub(EntitlementServiceInterface::class);
        $entitlements->method('checkQuota')->willReturn($quotaState);

        return new SmsBackupImportService($em, $interactionRepo, $entitlements, new NullLogger());
    }

    /**
     * @return array{type: string, phoneNumber: string, normalizedPhone: string, contactName: string, date: string, direction: string, durationSeconds: int|null}
     */
    private function makeSmsRecord(string $direction = 'incoming', int $dayOffsetSeconds = 0): array
    {
        return [
            'type' => ParsedRecord::TYPE_SMS,
            'phoneNumber' => self::PHONE,
            'normalizedPhone' => self::NORMALIZED,
            'contactName' => 'Alice',
            'date' => (new \DateTimeImmutable('@' . (1672531200 + $dayOffsetSeconds)))->format('c'),
            'direction' => $direction,
            'durationSeconds' => null,
        ];
    }

    /**
     * @return array{type: string, phoneNumber: string, normalizedPhone: string, contactName: string, date: string, direction: string, durationSeconds: int|null}
     */
    private function makeCallRecord(string $direction = 'incoming', int $duration = 36): array
    {
        return [
            'type' => ParsedRecord::TYPE_CALL,
            'phoneNumber' => self::PHONE,
            'normalizedPhone' => self::NORMALIZED,
            'contactName' => 'Alice',
            'date' => (new \DateTimeImmutable('@1672531200'))->format('c'),
            'direction' => $direction,
            'durationSeconds' => $duration,
        ];
    }

    // ── SMS grouping ─────────────────────────────────────────────────────────

    public function testThreeSmsOnSameDayProduceOneInteraction(): void
    {
        $service = $this->buildService($this->phoneMap);
        $options = new SmsBackupImportOptions();

        $records = [
            $this->makeSmsRecord('incoming', 0),
            $this->makeSmsRecord('incoming', 3600),   // +1 h, same UTC day
            $this->makeSmsRecord('outgoing', 7200),   // +2 h, same UTC day
        ];

        $result = $service->import($records, $options, $this->user);

        self::assertSame(1, $result->smsThreadsImported);
        self::assertSame(0, $result->callsImported);
        self::assertSame(0, $result->recordsSkipped);
    }

    public function testSmsSameContactDifferentDaysProduceTwoInteractions(): void
    {
        $service = $this->buildService($this->phoneMap);
        $options = new SmsBackupImportOptions();

        $records = [
            $this->makeSmsRecord('incoming', 0),
            $this->makeSmsRecord('incoming', 86400), // next UTC day
        ];

        $result = $service->import($records, $options, $this->user);

        self::assertSame(2, $result->smsThreadsImported);
        self::assertSame(0, $result->recordsSkipped);
    }

    // ── Call type mapping ────────────────────────────────────────────────────

    #[DataProvider('callDirectionProvider')]
    public function testCallDirectionMapping(string $direction, int $callsImported, int $skipped): void
    {
        $service = $this->buildService($this->phoneMap);
        $options = new SmsBackupImportOptions();
        $records = [$this->makeCallRecord($direction)];

        $result = $service->import($records, $options, $this->user);

        self::assertSame($callsImported, $result->callsImported);
        self::assertSame($skipped, $result->recordsSkipped);
    }

    /** @return array<string, array{0: string, 1: int, 2: int}> */
    public static function callDirectionProvider(): array
    {
        return [
            'incoming' => ['incoming', 1, 0],
            'outgoing' => ['outgoing', 1, 0],
            'missed'   => ['missed', 1, 0],
            'rejected' => ['rejected', 1, 0],
        ];
    }

    // ── Unknown contact handling ─────────────────────────────────────────────

    public function testUnknownContactSkippedWhenOptionIsSkip(): void
    {
        $service = $this->buildService([]); // empty phone map → no matches
        $options = new SmsBackupImportOptions(unknownNumbers: 'skip');
        $records = [$this->makeSmsRecord()];

        $result = $service->import($records, $options, $this->user);

        self::assertSame(0, $result->smsThreadsImported);
        self::assertSame(1, $result->recordsSkipped);
        self::assertSame(0, $result->contactsCreated);
    }

    // ── Skip alphanumeric ────────────────────────────────────────────────────

    public function testAlphanumericSenderSkippedByDefault(): void
    {
        $service = $this->buildService($this->phoneMap);
        $options = new SmsBackupImportOptions(skipAlphanumeric: true);

        /** @var array{type: string, phoneNumber: string, normalizedPhone: string, contactName: string, date: string, direction: string, durationSeconds: int|null} $record */
        $record = [
            'type' => ParsedRecord::TYPE_SMS,
            'phoneNumber' => 'Google',
            'normalizedPhone' => 'Google',
            'contactName' => '',
            'date' => (new \DateTimeImmutable('@1672531200'))->format('c'),
            'direction' => 'incoming',
            'durationSeconds' => null,
        ];

        $result = $service->import([$record], $options, $this->user);

        self::assertSame(0, $result->smsThreadsImported);
        self::assertSame(1, $result->recordsSkipped);
    }

    public function testAlphanumericFilterNotAppliedWhenOptionDisabled(): void
    {
        // When skipAlphanumeric=false the alphanumeric check is bypassed entirely.
        // The record still ends up skipped here because normalizedPhone is empty and
        // therefore has no match in the phone map (unknownNumbers='skip').
        // The important thing: recordsSkipped=1 and smsThreadsImported=0 for the right reason.
        $service = $this->buildService([]);
        $options = new SmsBackupImportOptions(skipAlphanumeric: false, unknownNumbers: 'skip');

        /** @var array{type: string, phoneNumber: string, normalizedPhone: string, contactName: string, date: string, direction: string, durationSeconds: int|null} $record */
        $record = [
            'type' => ParsedRecord::TYPE_SMS,
            'phoneNumber' => 'Google',
            'normalizedPhone' => '',   // no digits → not in phone map
            'contactName' => '',
            'date' => (new \DateTimeImmutable('@1672531200'))->format('c'),
            'direction' => 'incoming',
            'durationSeconds' => null,
        ];

        $result = $service->import([$record], $options, $this->user);

        self::assertSame(0, $result->smsThreadsImported);
        self::assertSame(0, $result->contactsCreated);
        self::assertSame(1, $result->recordsSkipped);
    }

    // ── Duplicate detection (skip strategy) ──────────────────────────────────

    public function testDuplicateCallSkippedWhenStrategyIsSkip(): void
    {
        $date = new \DateTimeImmutable('@1672531200');
        $dedupKey = self::CONTACT_ID . '|call|' . $date->getTimestamp();

        $service = $this->buildService($this->phoneMap, [$dedupKey => true]);
        $options = new SmsBackupImportOptions(duplicateStrategy: 'skip');
        $records = [$this->makeCallRecord()];

        $result = $service->import($records, $options, $this->user);

        self::assertSame(0, $result->callsImported);
        self::assertSame(1, $result->recordsSkipped);
    }

    public function testDuplicateCallCreatedWhenStrategyIsCreate(): void
    {
        $date = new \DateTimeImmutable('@1672531200');
        $dedupKey = self::CONTACT_ID . '|call|' . $date->getTimestamp();

        $service = $this->buildService($this->phoneMap, [$dedupKey => true]);
        $options = new SmsBackupImportOptions(duplicateStrategy: 'create');
        $records = [$this->makeCallRecord()];

        $result = $service->import($records, $options, $this->user);

        self::assertSame(1, $result->callsImported);
        self::assertSame(0, $result->recordsSkipped);
    }

    public function testDuplicateSmsThreadSkippedWhenStrategyIsSkip(): void
    {
        // Service groups SMS by UTC day and creates key "{contactId}|message|{firstDate->timestamp}".
        // For a single message at 1672531200 (2023-01-01 00:00 UTC) the key is predictable.
        $date = new \DateTimeImmutable('@1672531200');
        $dedupKey = self::CONTACT_ID . '|message|' . $date->getTimestamp();

        $service = $this->buildService($this->phoneMap, [$dedupKey => true]);
        $options = new SmsBackupImportOptions(duplicateStrategy: 'skip');
        $records = [$this->makeSmsRecord()];

        $result = $service->import($records, $options, $this->user);

        self::assertSame(0, $result->smsThreadsImported);
        self::assertSame(1, $result->recordsSkipped);
    }

    // ── Quota limit during contact creation ──────────────────────────────────

    public function testQuotaLimitStopsContactCreation(): void
    {
        $service = $this->buildService([], [], EntitlementState::Denied);
        $options = new SmsBackupImportOptions(unknownNumbers: 'create');
        $records = [$this->makeSmsRecord()];

        $result = $service->import($records, $options, $this->user);

        self::assertSame(0, $result->contactsCreated);
        // Record is skipped because no contact was created (quota blocked)
        self::assertSame(1, $result->recordsSkipped);
    }
}
