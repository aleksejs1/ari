<?php

namespace App\Tests\Unit\Service;

use App\Entity\Contact;
use App\Entity\ContactDate;
use App\Entity\ContactName;
use App\Entity\NotificationChannel;
use App\Entity\NotificationIntent;
use App\Entity\NotificationSubscription;
use App\Entity\User;
use App\Service\NotificationProcessingService;
use App\Service\TelegramService;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\EntityRepository;
use Doctrine\ORM\Query\FilterCollection;
use PHPUnit\Framework\TestCase;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Contracts\HttpClient\HttpClientInterface;

class NotificationProcessingServiceTest extends TestCase
{
    /** @var EntityManagerInterface&\PHPUnit\Framework\MockObject\Stub */
    private EntityManagerInterface $entityManager;
    private SpyTelegramService $telegramService;
    private NotificationProcessingService $service;

    #[\Override]
    protected function setUp(): void
    {
        $this->entityManager = self::createStub(EntityManagerInterface::class);
        $this->telegramService = new SpyTelegramService(self::createStub(HttpClientInterface::class));

        $this->service = new NotificationProcessingService(
            $this->entityManager,
            $this->telegramService
        );
    }

    public function testProcessAllSuccess(): void
    {
        $this->entityManager = self::createStub(EntityManagerInterface::class);
        $this->recreateService();
        
        $today = new \DateTime('today');
        
        $filters = self::createStub(FilterCollection::class);
        $this->entityManager->method('getFilters')->willReturn($filters);

        $channelRepo = self::createStub(EntityRepository::class);
        $this->entityManager->method('getRepository')
            ->willReturnMap([
                [NotificationChannel::class, $channelRepo],
            ]);

        $channel = self::createStub(NotificationChannel::class);
        $channel->method('getType')->willReturn('telegram');
        $channel->method('getConfig')->willReturn(['botToken' => 'token', 'chatId' => '123']);
        $channel->method('getUser')->willReturn(self::createStub(User::class));
        
        $channelRepo->method('findBy')->willReturn([$channel]);

        $subscription = self::createStub(NotificationSubscription::class);
        $subscription->method('getEnabled')->willReturn(1);
        $subscription->method('getEntityType')->willReturn('ContactDate');
        $subscription->method('getEntityId')->willReturn(10);
        
        $channel->method('getNotificationSubscriptions')->willReturn(new ArrayCollection([$subscription]));

        $contactDate = self::createStub(ContactDate::class);
        $contactDate->method('getDate')->willReturn($today);
        $contactDate->method('getText')->willReturn('Birthday');
        
        $this->entityManager->method('find')->willReturn($contactDate);

        $contact = self::createStub(Contact::class);
        $contactDate->method('getContact')->willReturn($contact);
        
        $contactName = self::createStub(ContactName::class);
        $contactName->method('getGiven')->willReturn('John');
        $contactName->method('getFamily')->willReturn('Doe');
        
        $contact->method('getContactNames')->willReturn(new ArrayCollection([$contactName]));

        $this->service->processAll();
        
        self::assertCount(1, $this->telegramService->sentMessages);
        self::assertStringContainsString('John Doe', $this->telegramService->sentMessages[0]['message']);
    }

    public function testProcessAllDisabledSubscription(): void
    {
        $this->setupBasicStubs();

        $subscription = self::createStub(NotificationSubscription::class);
        $subscription->method('getEnabled')->willReturn(0);
        
        $this->setupChannelWithSubscriptions([$subscription]);

        $this->service->processAll();
        
        self::assertEmpty($this->telegramService->sentMessages);
    }

    public function testProcessAllInvalidEntityType(): void
    {
        $this->setupBasicStubs();

        $subscription = self::createStub(NotificationSubscription::class);
        $subscription->method('getEnabled')->willReturn(1);
        $subscription->method('getEntityType')->willReturn('OtherType');
        
        $this->setupChannelWithSubscriptions([$subscription]);

        $this->service->processAll();
        self::assertEmpty($this->telegramService->sentMessages);
    }

    public function testProcessAllEntityNotFound(): void
    {
        $this->setupBasicStubs();

        $subscription = self::createStub(NotificationSubscription::class);
        $subscription->method('getEnabled')->willReturn(1);
        $subscription->method('getEntityType')->willReturn('ContactDate');
        
        $this->setupChannelWithSubscriptions([$subscription]);

        $this->entityManager->method('find')->willReturn(null);

        $this->service->processAll();
        self::assertEmpty($this->telegramService->sentMessages);
    }

    public function testProcessAllDateMismatch(): void
    {
        $this->setupBasicStubs();

        $subscription = self::createStub(NotificationSubscription::class);
        $subscription->method('getEnabled')->willReturn(1);
        $subscription->method('getEntityType')->willReturn('ContactDate');
        
        $this->setupChannelWithSubscriptions([$subscription]);

        $contactDate = self::createStub(ContactDate::class);
        $contactDate->method('getDate')->willReturn(new \DateTime('yesterday'));
        $this->entityManager->method('find')->willReturn($contactDate);

        $this->service->processAll();
        self::assertEmpty($this->telegramService->sentMessages);
    }

    public function testProcessAllMissingConfig(): void
    {
        $this->setupBasicStubs();
        
        $today = new \DateTime('today');
        $subscription = self::createStub(NotificationSubscription::class);
        $subscription->method('getEnabled')->willReturn(1);
        $subscription->method('getEntityType')->willReturn('ContactDate');
        
        $channel = $this->setupChannelWithSubscriptions([$subscription]);
        $channel->method('getConfig')->willReturn([]);

        $contactDate = self::createStub(ContactDate::class);
        $contactDate->method('getDate')->willReturn($today);
        $this->entityManager->method('find')->willReturn($contactDate);

        $io = self::createStub(SymfonyStyle::class);
        
        $this->service->processAll($io);
        self::assertEmpty($this->telegramService->sentMessages);
    }

    public function testProcessAllTelegramError(): void
    {
        $this->setupBasicStubs();
        
        $today = new \DateTime('today');
        $subscription = self::createStub(NotificationSubscription::class);
        $subscription->method('getEnabled')->willReturn(1);
        $subscription->method('getEntityType')->willReturn('ContactDate');
        
        $channel = $this->setupChannelWithSubscriptions([$subscription]);
        $channel->method('getConfig')->willReturn(['botToken' => 'token', 'chatId' => '123']);

        $contactDate = self::createStub(ContactDate::class);
        $contactDate->method('getDate')->willReturn($today);
        $this->entityManager->method('find')->willReturn($contactDate);

        $this->telegramService->shouldThrow = true;

        $io = self::createStub(SymfonyStyle::class);

        $this->service->processAll($io);
        
        // Assert attempt was made
        self::assertCount(1, $this->telegramService->sentMessages);
    }
    
    private function setupBasicStubs(): void
    {
        $filters = self::createStub(FilterCollection::class);
        $this->entityManager->method('getFilters')->willReturn($filters);
    }
    
    private function recreateService(): void
    {
        $this->service = new NotificationProcessingService(
            $this->entityManager,
            $this->telegramService
        );
    }

    /**
     * @param array<\App\Entity\NotificationSubscription> $subs
     * @return NotificationChannel&\PHPUnit\Framework\MockObject\Stub
     */
    private function setupChannelWithSubscriptions(array $subs): object
    {
        $channelRepo = self::createStub(EntityRepository::class);
        $this->entityManager->method('getRepository')->willReturn($channelRepo);

        $channel = self::createStub(NotificationChannel::class);
        $channelRepo->method('findBy')->willReturn([$channel]);
        $channel->method('getNotificationSubscriptions')->willReturn(new ArrayCollection($subs));
        
        return $channel;
    }
}

class SpyTelegramService extends TelegramService {
    /** @var array<int, array<string, string>> */
    public array $sentMessages = [];
    public bool $shouldThrow = false;

    #[\Override]
    public function sendMessage(string $botToken, string $chatId, string $message): void
    {
        $this->sentMessages[] = [
            'botToken' => $botToken,
            'chatId' => $chatId,
            'message' => $message
        ];
        
        if ($this->shouldThrow) {
            throw new \Exception('Error');
        }
    }
}
