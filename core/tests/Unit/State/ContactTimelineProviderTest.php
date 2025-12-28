<?php

namespace App\Tests\Unit\State;

use ApiPlatform\Metadata\Operation;
use App\ApiResource\ContactTimeline;
use App\Entity\AuditLog;
use App\Entity\Contact;
use App\Entity\ContactDate;
use App\Entity\ContactName;
use App\Repository\AuditLogRepository;
use App\Repository\ContactRepository;
use App\State\ContactTimelineProvider;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\EntityManagerInterface;
use PHPUnit\Framework\TestCase;
use PHPUnit\Framework\Attributes\AllowMockObjectsWithoutExpectations;

#[AllowMockObjectsWithoutExpectations]
class ContactTimelineProviderTest extends TestCase
{
    public function testProvideSortsContactEntityLastWhenDatesAreEqual(): void
    {
        // Mock Dependencies
        $entityManager = $this->createMock(EntityManagerInterface::class);
        $contactRepository = $this->createMock(ContactRepository::class);
        $auditLogRepository = $this->createMock(AuditLogRepository::class);

        // Setup Contact
        $contact = new Contact();
        $refContact = new \ReflectionClass(Contact::class);
        $propId = $refContact->getProperty('id');
        // $prop->setAccessible(true);
        $propId->setValue($contact, 123);

        $entityManager->method('getRepository')->willReturnMap([
            [Contact::class, $contactRepository],
            [AuditLog::class, $auditLogRepository],
        ]);

        $contactRepository->method('find')->with(123)->willReturn($contact);

        // Setup Audit Logs
        $date = new \DateTime('2025-01-01 12:00:00');

        $logContact = new AuditLog();
        $logContact->setEntityType(Contact::class);
        // $logContact->setModDate($date);
        // AuditLog usually has setCreatedAt, but let's check the entity.
        // The provider uses getCreatedAt.

        // Reflection to set createdAt if no setter exists or it's set automatically
        $this->setCreatedAt($logContact, $date);
        $logContact->setAction('UPDATE');

        $logName = new AuditLog();
        $logName->setEntityType(ContactName::class);
        $this->setCreatedAt($logName, $date);

        $logDate = new AuditLog();
        $logDate->setEntityType(ContactDate::class);
        $this->setCreatedAt($logDate, $date);

        // Return logs. The provider fetches by entity type/id.
        // We can mock findBy to return everything for simplicity or strict matches.
        // The provider calls findBy multiple times.

        $auditLogRepository->method('findBy')
            ->willReturnCallback(function ($criteria) use ($logContact, $logName, $logDate) {
                if ($criteria['entityType'] === Contact::class) {
                    return [$logContact];
                }
            if ($criteria['entityType'] === ContactName::class) {
                return [$logName];
            }
            if ($criteria['entityType'] === ContactDate::class) {
                return [$logDate];
            }
            return [];
        });

        // Add dummy relations to Contact to trigger lookups
        $name = new ContactName();
        $this->setId($name, 1);
        $contact->addContactName($name);

        $cDate = new ContactDate();
        $this->setId($cDate, 1);
        $contact->addContactDate($cDate);

        // Execute
        $provider = new ContactTimelineProvider($entityManager);
        $operation = $this->createMock(Operation::class);

        /** @var ContactTimeline $result */
        $result = $provider->provide($operation, ['id' => 123]);

        $sortedLogs = $result->logs;
        self::assertCount(3, $sortedLogs);

        // Convert to array
        $logs = $sortedLogs->toArray();

        // Logic: Dates are equal. Contact should be LAST.
        // The other two can be in any order relative to each other (stable sort or just undefined).
        // But Contact MUST be at index 2 (0, 1, 2).

        $lastLog = $logs[2];
        self::assertEquals(
            Contact::class,
            $lastLog->getEntityType(),
            'Contact entity should be last when dates are equal'
        );
    }

    private function setCreatedAt(AuditLog $log, \DateTime $date): void
    {
        // specific implementation depends on AuditLog class, assuming standard behavior
        // or using reflection if property is private/readonly without setter
        $ref = new \ReflectionClass(AuditLog::class);
        if ($ref->hasProperty('createdAt')) {
            $prop = $ref->getProperty('createdAt');
            // $prop->setAccessible(true);
            $prop->setValue($log, $date);
        }
    }

    private function setId(object $entity, int $id): void
    {
        $ref = new \ReflectionClass($entity);
        $prop = $ref->getProperty('id');
        // $prop->setAccessible(true);
        $prop->setValue($entity, $id);
    }
}
