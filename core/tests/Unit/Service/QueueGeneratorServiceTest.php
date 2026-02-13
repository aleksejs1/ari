<?php

namespace Ari\Tests\Unit\Service;

use Ari\Entity\Contact;
use Ari\Entity\ContactDate;
use Ari\Entity\NotificationQueue;
use Ari\Entity\NotificationRule;
use Ari\Entity\User;
use Ari\Repository\ContactDateRepository;
use Ari\Repository\NotificationQueueRepository;
use Ari\Repository\NotificationRuleRepository;
use Ari\Service\QueueGeneratorService;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Query\FilterCollection;
use PHPUnit\Framework\TestCase;

class QueueGeneratorServiceTest extends TestCase
{
    /** @var ContactDateRepository&\PHPUnit\Framework\MockObject\Stub */
    private ContactDateRepository $contactDateRepository;
    /** @var NotificationRuleRepository&\PHPUnit\Framework\MockObject\Stub */
    private NotificationRuleRepository $notificationRuleRepository;
    /** @var NotificationQueueRepository&\PHPUnit\Framework\MockObject\Stub */
    private NotificationQueueRepository $notificationQueueRepository;
    /** @var EntityManagerInterface&\PHPUnit\Framework\MockObject\Stub */
    private EntityManagerInterface $entityManager;

    private QueueGeneratorService $service;

    #[\Override]
    protected function setUp(): void
    {
        $this->contactDateRepository = self::createStub(ContactDateRepository::class);
        $this->notificationRuleRepository = self::createStub(NotificationRuleRepository::class);
        $this->notificationQueueRepository = self::createStub(NotificationQueueRepository::class);
        $this->entityManager = self::createStub(EntityManagerInterface::class);

        $this->service = new QueueGeneratorService(
            $this->contactDateRepository,
            $this->notificationRuleRepository,
            $this->notificationQueueRepository,
            $this->entityManager,
        );
    }

    public function testGenerateSuccess(): void
    {
        // Require expectations on EntityManager
        $this->entityManager = self::createStub(EntityManagerInterface::class);

        // Re-create service
        $this->service = new QueueGeneratorService(
            $this->contactDateRepository,
            $this->notificationRuleRepository,
            $this->notificationQueueRepository,
            $this->entityManager,
        );

        $executionDate = new \DateTime('2023-10-23 10:00:00');

        $tenant = self::createStub(User::class);
        $tenant->method('getId')->willReturn(1);

        $rule = self::createStub(NotificationRule::class);
        $rule->method('getOffsetDays')->willReturn(2);
        $rule->method('getOffsetTime')->willReturn('11:00');
        $rule->method('getEventType')->willReturn('Birthday');
        $rule->method('getTargetType')->willReturn('ALL');
        $rule->method('getTenant')->willReturn($tenant);

        $this->notificationRuleRepository->method('findAll')->willReturn([$rule]);

        // Mock Filters (Spy)
        $filters = self::createStub(FilterCollection::class);
        $this->entityManager->method('getFilters')->willReturn($filters);
        $filters->method('isEnabled')->willReturn(true);

        $disabledFilters = [];
        $filters->method('disable')->willReturnCallback(function ($f) use (&$disabledFilters) {
            $disabledFilters[] = $f;

            return self::createStub(\Doctrine\ORM\Query\Filter\SQLFilter::class);
        });

        $contactDate = self::createStub(ContactDate::class);
        $contactDate->method('getText')->willReturn('Birthday');
        $contactDate->method('getDate')->willReturn(new \DateTime('1990-10-25'));

        $contact = self::createStub(Contact::class);
        $contact->method('getId')->willReturn(100);
        $contact->method('getTenant')->willReturn($tenant);
        $contact->method('getDisplayName')->willReturn('John Doe');
        $contactDate->method('getContact')->willReturn($contact);

        $this->contactDateRepository->method('findMatchingDates')
            ->willReturn([$contactDate]);

        $this->notificationQueueRepository->method('findOneBy')->willReturn(null);

        // Spy persistence
        $persistedQueue = null;
        $this->entityManager->method('persist')->willReturnCallback(function ($obj) use (&$persistedQueue) {
            if ($obj instanceof NotificationQueue) {
                $persistedQueue = $obj;
            }
        });

        $flushed = false;
        $this->entityManager->method('flush')->willReturnCallback(function () use (&$flushed) {
            $flushed = true;
        });

        $count = $this->service->generate($executionDate);
        self::assertEquals(1, $count);

        self::assertContains('tenant', $disabledFilters);
        self::assertTrue($flushed);
        self::assertNotNull($persistedQueue);

        $scheduledAt = $persistedQueue->getScheduledAt();
        self::assertSame($rule, $persistedQueue->getRule());
        self::assertSame($contact, $persistedQueue->getContact());
        self::assertNotNull($scheduledAt);
        self::assertEquals('11:00', $scheduledAt->format('H:i'));
    }

    public function testGenerateDuplicate(): void
    {
        // Re-create service
        $this->service = new QueueGeneratorService(
            $this->contactDateRepository,
            $this->notificationRuleRepository,
            $this->notificationQueueRepository,
            $this->entityManager,
        );

        $executionDate = new \DateTime('2023-10-27 10:00:00');

        $rule = self::createStub(NotificationRule::class);
        $rule->method('getOffsetDays')->willReturn(0);

        $this->notificationRuleRepository->method('findAll')->willReturn([$rule]);

        // stub filters
        $filters = self::createStub(FilterCollection::class);
        $this->entityManager->method('getFilters')->willReturn($filters);

        $contactDate = self::createStub(ContactDate::class);
        $contact = self::createStub(Contact::class);
        $contactDate->method('getContact')->willReturn($contact);
        $contactDate->method('getDate')->willReturn(new \DateTime());

        $this->contactDateRepository->method('findMatchingDates')->willReturn([$contactDate]);

        // Mock existing item
        $this->notificationQueueRepository->method('findOneBy')->willReturn(self::createStub(NotificationQueue::class));

        $persisted = [];
        $this->entityManager->method('persist')->willReturnCallback(function ($obj) use (&$persisted) {
            $persisted[] = $obj;
        });

        $count = $this->service->generate($executionDate);
        self::assertEquals(0, $count);
        self::assertEmpty($persisted);
    }
}
