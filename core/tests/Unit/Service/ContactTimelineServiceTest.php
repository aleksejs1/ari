<?php

namespace Ari\Tests\Unit\Service;

use Ari\Entity\AuditLog;
use Ari\Entity\Contact;
use Ari\Entity\ContactDate;
use Ari\Entity\ContactName;
use Ari\Repository\AuditLogRepository;
use Ari\Service\ContactTimelineService;
use Doctrine\ORM\EntityManagerInterface;
use PHPUnit\Framework\Attributes\AllowMockObjectsWithoutExpectations;
use PHPUnit\Framework\TestCase;

#[AllowMockObjectsWithoutExpectations]
class ContactTimelineServiceTest extends TestCase
{
    public function testGetTimelineSortsContactEntityLastWhenDatesAreEqual(): void
    {
        // Mock Dependencies
        $entityManager = self::createStub(EntityManagerInterface::class);
        $auditLogRepository = self::createStub(AuditLogRepository::class);

        $entityManager->method('getRepository')
            ->willReturnMap([
                [AuditLog::class, $auditLogRepository],
            ]);

        // Setup Audit Logs
        $date = new \DateTime('2025-01-01 12:00:00');

        $logContact = new AuditLog();
        $logContact->setEntityType(Contact::class);
        $this->setCreatedAt($logContact, $date);
        $logContact->setAction('INSERT');

        $logName = new AuditLog();
        $logName->setEntityType(ContactName::class);
        $this->setCreatedAt($logName, $date);

        $logDate = new AuditLog();
        $logDate->setEntityType(ContactDate::class);
        $this->setCreatedAt($logDate, $date);

        $auditLogRepository->method('findBy')
            ->willReturnCallback(function ($criteria) use ($logContact, $logName, $logDate) {
                if (isset($criteria['entityType']) && Contact::class === $criteria['entityType']) {
                    return [$logContact];
                }
                if (isset($criteria['ownerEntityType']) && Contact::class === $criteria['ownerEntityType']) {
                    return [$logName, $logDate];
                }

                return [];
            });

        $service = new ContactTimelineService($entityManager);

        // Execute
        $result = $service->getTimeline(123);

        self::assertCount(3, $result);
        $logs = $result->toArray();

        // Logic: Dates are equal. Contact should be LAST.
        $lastLog = $logs[2];
        self::assertEquals(
            Contact::class,
            $lastLog->getEntityType(),
            'Contact entity should be last when dates are equal',
        );
    }

    private function setCreatedAt(AuditLog $log, \DateTime $date): void
    {
        $ref = new \ReflectionClass(AuditLog::class);
        if ($ref->hasProperty('createdAt')) {
            $prop = $ref->getProperty('createdAt');
            $prop->setValue($log, $date);
        }
    }
}
