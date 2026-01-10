<?php

namespace App\Tests\Unit\Service\Notification;

use App\Entity\NotificationChannel;
use App\Entity\NotificationQueue;
use App\Repository\NotificationQueueRepository;
use App\Service\Notification\NotificationProcessor;
use App\Service\Notification\NotificationSenderInterface;
use Doctrine\ORM\EntityManagerInterface;
use PHPUnit\Framework\Attributes\AllowMockObjectsWithoutExpectations;
use PHPUnit\Framework\MockObject\MockObject;
use PHPUnit\Framework\TestCase;
use Psr\Log\LoggerInterface;
use Symfony\Component\DependencyInjection\ServiceLocator;

class NotificationProcessorTest extends TestCase
{
    private NotificationQueueRepository&MockObject $repository;
    private EntityManagerInterface&MockObject $entityManager;
    /** @var ServiceLocator<mixed>&MockObject */
    private ServiceLocator&MockObject $senders;
    private LoggerInterface&MockObject $logger;
    private NotificationProcessor $processor;

    #[\Override]
    protected function setUp(): void
    {
        $this->repository = $this->createMock(NotificationQueueRepository::class);
        $this->entityManager = $this->createMock(EntityManagerInterface::class);
        $this->senders = $this->createMock(ServiceLocator::class);
        $this->logger = $this->createMock(LoggerInterface::class);

        $this->processor = new NotificationProcessor(
            $this->repository,
            $this->entityManager,
            $this->senders,
            $this->logger,
        );
    }

    #[AllowMockObjectsWithoutExpectations]
    public function testProcessPendingItemsSuccess(): void
    {
        $item = new NotificationQueue();
        $channel = new NotificationChannel();
        $channel->setType('web');
        $item->setChannel($channel);
        $item->setAttempts(0);

        $sender = $this->createMock(NotificationSenderInterface::class);
        $sender->expects($this->once())->method('send')->with($item);

        $this->repository->expects($this->once())
            ->method('findPendingItems')
            ->willReturn([$item]);

        $this->senders->expects($this->atLeastOnce())
            ->method('has')
            ->with('web')
            ->willReturn(true);
        $this->senders->expects($this->once())
            ->method('get')
            ->with('web')
            ->willReturn($sender);

        $this->entityManager->expects($this->once())->method('flush');

        $count = $this->processor->process(10);

        self::assertEquals(1, $count);
        self::assertEquals('sent', $item->getStatus());
        self::assertEquals(1, $item->getAttempts());
    }

    public function testProcessPendingItemsNoSender(): void
    {
        $item = new NotificationQueue();
        $channel = new NotificationChannel();
        $channel->setType('sms'); // 'email' now exists, so use 'sms' for no sender test
        $item->setChannel($channel);

        $this->repository->expects($this->once())
            ->method('findPendingItems')
            ->willReturn([$item]);

        $this->senders->expects($this->atLeastOnce())
            ->method('has')
            ->with('sms')
            ->willReturn(false);

        $this->logger->expects($this->once())->method('error');
        $this->entityManager->expects($this->once())->method('flush');

        $count = $this->processor->process(10);

        self::assertEquals(0, $count);
        self::assertEquals('failed', $item->getStatus());
        self::assertEquals('No sender found for type: sms', $item->getResult());
    }
}
