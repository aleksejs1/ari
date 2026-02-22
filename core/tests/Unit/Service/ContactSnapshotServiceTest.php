<?php

namespace Ari\Tests\Unit\Service;

use Ari\Entity\AuditLog;
use Ari\Entity\Contact;
use Ari\Repository\AuditLogRepository;
use Ari\Service\ContactSnapshotService;
use PHPUnit\Framework\TestCase;

class ContactSnapshotServiceTest extends TestCase
{
    /** @var AuditLogRepository&\PHPUnit\Framework\MockObject\Stub */
    private AuditLogRepository $repository;
    private ContactSnapshotService $service;

    #[\Override]
    protected function setUp(): void
    {
        $this->repository = self::createStub(AuditLogRepository::class);
        $this->service = new ContactSnapshotService($this->repository);
    }

    public function testApplyInsert(): void
    {
        $log = $this->makeLog(Contact::class, '1', 'INSERT', snapshotAfter: ['id' => 1, 'uuid' => 'abc']);

        $this->repository->method('findTimelineLogsUpTo')->willReturn([$log]);

        $result = $this->service->getSnapshotAtLog(1, 1);

        self::assertNotNull($result);
        self::assertSame(['id' => 1, 'uuid' => 'abc'], $result['contact']);
        self::assertSame([], $result['contactNames']);
        self::assertSame([], $result['contactPhoneNumbers']);
    }

    public function testApplyUpdate(): void
    {
        $log1 = $this->makeLog('Ari\Entity\ContactName', '10', 'INSERT', snapshotAfter: ['id' => 10, 'given' => 'John', 'family' => 'Doe']);
        $log2 = $this->makeLog('Ari\Entity\ContactName', '10', 'UPDATE', snapshotAfter: ['id' => 10, 'given' => 'Jane', 'family' => 'Doe']);

        $this->repository->method('findTimelineLogsUpTo')->willReturn([$log1, $log2]);

        $result = $this->service->getSnapshotAtLog(1, 2);

        self::assertNotNull($result);
        self::assertCount(1, $result['contactNames']);
        self::assertSame('Jane', $result['contactNames'][0]['given']);
    }

    public function testApplyUpdateWithChangesOnly(): void
    {
        $log1 = $this->makeLog('Ari\Entity\ContactName', '10', 'INSERT', snapshotAfter: ['id' => 10, 'given' => 'John', 'family' => 'Doe']);
        // Old format: UPDATE with only changes, no snapshotAfter
        $log2 = $this->makeLog('Ari\Entity\ContactName', '10', 'UPDATE', changes: ['given' => ['John', 'Jane']]);

        $this->repository->method('findTimelineLogsUpTo')->willReturn([$log1, $log2]);

        $result = $this->service->getSnapshotAtLog(1, 2);

        self::assertNotNull($result);
        self::assertCount(1, $result['contactNames']);
        self::assertSame('Jane', $result['contactNames'][0]['given']);
        self::assertSame('Doe', $result['contactNames'][0]['family']);
    }

    public function testApplyRemove(): void
    {
        $logInsert = $this->makeLog('Ari\Entity\ContactPhoneNumber', '20', 'INSERT', snapshotAfter: ['id' => 20, 'value' => '123456']);
        $logRemove = $this->makeLog('Ari\Entity\ContactPhoneNumber', '20', 'REMOVE');

        $this->repository->method('findTimelineLogsUpTo')->willReturn([$logInsert, $logRemove]);

        $result = $this->service->getSnapshotAtLog(1, 2);

        self::assertNotNull($result);
        self::assertSame([], $result['contactPhoneNumbers']);
    }

    public function testComplexScenario(): void
    {
        // Scenario: Contact created → name "Володя" → phone → family name added → birthday → rename to "Владислав"
        $logs = [
            $this->makeLog(Contact::class, '1', 'INSERT', snapshotAfter: ['id' => 1, 'uuid' => 'abc']),
            $this->makeLog('Ari\Entity\ContactName', '10', 'INSERT', snapshotAfter: ['id' => 10, 'given' => 'Володя', 'family' => null]),
            $this->makeLog('Ari\Entity\ContactPhoneNumber', '20', 'INSERT', snapshotAfter: ['id' => 20, 'value' => '1234567', 'type' => 'mobile']),
            $this->makeLog('Ari\Entity\ContactName', '10', 'UPDATE', snapshotAfter: ['id' => 10, 'given' => 'Володя', 'family' => 'Иванов']),
            $this->makeLog('Ari\Entity\ContactDate', '30', 'INSERT', snapshotAfter: ['id' => 30, 'text' => 'Birthday', 'date' => '1990-01-01']),
            $this->makeLog('Ari\Entity\ContactName', '10', 'UPDATE', snapshotAfter: ['id' => 10, 'given' => 'Владислав', 'family' => 'Иванов']),
        ];

        // Snapshot at log index 1 (after name INSERT) — only contact + name "Володя"
        $this->repository->method('findTimelineLogsUpTo')->willReturn(array_slice($logs, 0, 2));
        $result = $this->service->getSnapshotAtLog(1, 2);

        self::assertNotNull($result);
        self::assertSame('Володя', $result['contactNames'][0]['given']);
        self::assertNull($result['contactNames'][0]['family']);
        self::assertSame([], $result['contactPhoneNumbers']);
        self::assertSame([], $result['contactDates']);

        // Snapshot at log index 3 (after family name added via UPDATE)
        $this->repository = self::createStub(AuditLogRepository::class);
        $this->repository->method('findTimelineLogsUpTo')->willReturn(array_slice($logs, 0, 4));
        $service = new ContactSnapshotService($this->repository);
        $result = $service->getSnapshotAtLog(1, 4);

        self::assertNotNull($result);
        self::assertSame('Володя', $result['contactNames'][0]['given']);
        self::assertSame('Иванов', $result['contactNames'][0]['family']);
        self::assertCount(1, $result['contactPhoneNumbers']);

        // Snapshot at final log (after rename to Владислав)
        $this->repository = self::createStub(AuditLogRepository::class);
        $this->repository->method('findTimelineLogsUpTo')->willReturn($logs);
        $service = new ContactSnapshotService($this->repository);
        $result = $service->getSnapshotAtLog(1, 6);

        self::assertNotNull($result);
        self::assertSame('Владислав', $result['contactNames'][0]['given']);
        self::assertSame('Иванов', $result['contactNames'][0]['family']);
        self::assertCount(1, $result['contactPhoneNumbers']);
        self::assertCount(1, $result['contactDates']);
        self::assertSame('Birthday', $result['contactDates'][0]['text']);
    }

    public function testReturnsNullWhenNoLogs(): void
    {
        $this->repository->method('findTimelineLogsUpTo')->willReturn([]);

        $result = $this->service->getSnapshotAtLog(1, 999);

        self::assertNull($result);
    }

    public function testStripsSystemFields(): void
    {
        $log1 = $this->makeLog(Contact::class, '1', 'INSERT', snapshotAfter: ['id' => 1, 'uuid' => 'abc', 'user' => '/api/users/1', 'tenant' => '/api/users/1']);
        $log2 = $this->makeLog('Ari\Entity\ContactName', '10', 'INSERT', snapshotAfter: ['id' => 10, 'given' => 'John', 'user' => '/api/users/1', 'tenant' => '/api/users/1']);

        $this->repository->method('findTimelineLogsUpTo')->willReturn([$log1, $log2]);

        $result = $this->service->getSnapshotAtLog(1, 2);

        self::assertNotNull($result);
        self::assertArrayNotHasKey('user', $result['contact']);
        self::assertArrayNotHasKey('tenant', $result['contact']);
        self::assertArrayNotHasKey('user', $result['contactNames'][0]);
        self::assertArrayNotHasKey('tenant', $result['contactNames'][0]);
    }

    /**
     * @param array<string, mixed>|null $snapshotAfter
     * @param array<string, mixed>|null $changes
     */
    private function makeLog(
        string $entityType,
        string $entityId,
        string $action,
        ?array $snapshotAfter = null,
        ?array $changes = null,
    ): AuditLog {
        $log = new AuditLog();
        $log->setEntityType($entityType);
        $log->setEntityId($entityId);
        $log->setAction($action);
        $log->setSnapshotAfter($snapshotAfter);
        $log->setChanges($changes);

        return $log;
    }
}
