<?php

namespace Ari\Tests\Unit\Service\Notification;

use Ari\Entity\NotificationChannel;
use Ari\Entity\NotificationQueue;
use Ari\Repository\NotificationQueueRepository;
use Ari\Service\Notification\NotificationProcessor;
use Ari\Service\Notification\NotificationSenderInterface;
use Doctrine\ORM\EntityManagerInterface;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\TestCase;
use Psr\Log\LoggerInterface;
use Symfony\Component\DependencyInjection\ServiceLocator;

#[CoversClass(NotificationProcessor::class)]
class NotificationProcessorTest extends TestCase
{
    /** @var NotificationQueueRepository&\PHPUnit\Framework\MockObject\Stub */
    private NotificationQueueRepository $queueRepository;
    /** @var EntityManagerInterface&\PHPUnit\Framework\MockObject\Stub */
    private EntityManagerInterface $entityManager;
    /** @var ServiceLocator<mixed>&\PHPUnit\Framework\MockObject\Stub */
    private ServiceLocator $senders;
    /** @var LoggerInterface&\PHPUnit\Framework\MockObject\Stub */
    private LoggerInterface $logger;
    private NotificationProcessor $processor;

    #[\Override]
    protected function setUp(): void
    {
        $this->queueRepository = self::createStub(NotificationQueueRepository::class);
        $this->entityManager = self::createStub(EntityManagerInterface::class);
        $this->senders = self::createStub(ServiceLocator::class);
        $this->logger = self::createStub(LoggerInterface::class);

        $this->processor = new NotificationProcessor(
            $this->queueRepository,
            $this->entityManager,
            $this->senders,
            $this->logger,
        );
    }

    public function testProcessSuccess(): void
    {
        $flushed = false;
        $this->entityManager->method('flush')->willReturnCallback(function () use (&$flushed) {
            $flushed = true;
        });

        $item = self::createStub(NotificationQueue::class);
        $channel = self::createStub(NotificationChannel::class);

        $item->method('getChannel')->willReturn($channel);
        $channel->method('getType')->willReturn('email');

        $sender = self::createStub(NotificationSenderInterface::class);
        $senderCalled = false;
        $sender->method('send')->willReturnCallback(function ($i) use (&$senderCalled, $item) {
            if ($i === $item) {
                $senderCalled = true;
            }
        });

        $this->senders->method('has')->willReturn(true);
        $this->senders->method('get')->willReturn($sender);

        $this->queueRepository->method('findPendingItems')->willReturn([$item]);

        $itemCalls = [];
        $item->method('setStatus')->willReturnCallback(function ($s) use (&$itemCalls, $item) {
            $itemCalls['status'] = $s;

            return $item;
        });
        $item->method('setResult')->willReturnCallback(function ($r) use (&$itemCalls, $item) {
            $itemCalls['result'] = $r;

            return $item;
        });
        $item->method('setAttempts')->willReturnCallback(function () use (&$itemCalls, $item) {
            $itemCalls['attempts'] = true;

            return $item;
        });

        $processed = $this->processor->process();
        self::assertEquals(1, $processed);

        self::assertTrue($flushed, 'Flush should be called');
        self::assertTrue($senderCalled, 'Sender should be called');
        self::assertEquals('sent', $itemCalls['status'] ?? null);
        self::assertEquals('Sent successfully', $itemCalls['result'] ?? null);
        self::assertTrue($itemCalls['attempts'] ?? false);
    }

    public function testProcessNoChannel(): void
    {
        $logError = [];
        $this->logger->method('error')->willReturnCallback(function ($msg, $ctx) use (&$logError) {
            $logError = ['msg' => $msg, 'ctx' => $ctx];
        });

        $item = self::createStub(NotificationQueue::class);
        $item->method('getChannel')->willReturn(null);
        $item->method('getId')->willReturn(1);

        $itemStatus = null;
        $item->method('setStatus')->willReturnCallback(function ($s) use (&$itemStatus, $item) {
            $itemStatus = $s;

            return $item;
        });

        $this->queueRepository->method('findPendingItems')->willReturn([$item]);

        $processed = $this->processor->process();
        self::assertEquals(0, $processed);

        self::assertEquals('Notification item has no channel', $logError['msg'] ?? null);
        self::assertEquals(['queue_id' => 1], $logError['ctx'] ?? []);
        self::assertEquals('failed', $itemStatus);
    }

    public function testProcessNoChannelType(): void
    {
        $logError = [];
        $this->logger->method('error')->willReturnCallback(function ($msg, $ctx) use (&$logError) {
            $logError = ['msg' => $msg, 'ctx' => $ctx];
        });

        $item = self::createStub(NotificationQueue::class);
        $channel = self::createStub(NotificationChannel::class);
        $item->method('getChannel')->willReturn($channel);
        $item->method('getId')->willReturn(1);
        $channel->method('getType')->willReturn(null);

        $itemStatus = null;
        $item->method('setStatus')->willReturnCallback(function ($s) use (&$itemStatus, $item) {
            $itemStatus = $s;

            return $item;
        });

        $this->queueRepository->method('findPendingItems')->willReturn([$item]);

        $processed = $this->processor->process();
        self::assertEquals(0, $processed);

        self::assertEquals('Notification channel has no type', $logError['msg'] ?? null);
        self::assertEquals('failed', $itemStatus);
    }

    public function testProcessNoSender(): void
    {
        $logError = [];
        $this->logger->method('error')->willReturnCallback(function ($msg, $ctx) use (&$logError) {
            $logError = ['msg' => $msg, 'ctx' => $ctx];
        });

        $item = self::createStub(NotificationQueue::class);
        $channel = self::createStub(NotificationChannel::class);
        $item->method('getChannel')->willReturn($channel);
        $item->method('getId')->willReturn(1);
        $channel->method('getType')->willReturn('unsupported');

        $itemStatus = null;
        $item->method('setStatus')->willReturnCallback(function ($s) use (&$itemStatus, $item) {
            $itemStatus = $s;

            return $item;
        });

        $this->queueRepository->method('findPendingItems')->willReturn([$item]);
        $this->senders->method('has')->willReturn(false);

        $processed = $this->processor->process();
        self::assertEquals(0, $processed);

        self::assertEquals('No sender found for channel type: unsupported', $logError['msg'] ?? null);
        self::assertEquals('failed', $itemStatus);
    }

    public function testProcessSenderError(): void
    {
        $logError = [];
        $this->logger->method('error')->willReturnCallback(function ($msg, $ctx) use (&$logError) {
            $logError = ['msg' => $msg, 'ctx' => $ctx];
        });

        $item = self::createStub(NotificationQueue::class);
        $channel = self::createStub(NotificationChannel::class);
        $item->method('getChannel')->willReturn($channel);
        $item->method('getId')->willReturn(1);
        $channel->method('getType')->willReturn('email');

        $itemStatus = null;
        $itemResult = null;
        $item->method('setStatus')->willReturnCallback(function ($s) use (&$itemStatus, $item) {
            $itemStatus = $s;

            return $item;
        });
        $item->method('setResult')->willReturnCallback(function ($s) use (&$itemResult, $item) {
            $itemResult = $s;

            return $item;
        });

        $sender = self::createStub(NotificationSenderInterface::class);
        $this->senders->method('has')->willReturn(true);
        $this->senders->method('get')->willReturn($sender);

        $this->queueRepository->method('findPendingItems')->willReturn([$item]);

        $sender->method('send')->willReturnCallback(function () {
            throw new \Exception('Connection lost');
        });

        $processed = $this->processor->process();
        self::assertEquals(0, $processed);

        self::assertNotNull($logError['msg'] ?? null);
        self::assertEquals('failed', $itemStatus);
        self::assertEquals('Error: Connection lost', $itemResult);
    }
}
