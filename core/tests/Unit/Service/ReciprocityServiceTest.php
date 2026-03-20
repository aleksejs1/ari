<?php

declare(strict_types=1);

namespace Ari\Tests\Unit\Service;

use Ari\Entity\Contact;
use Ari\Repository\ContactInteractionRepository;
use Ari\Service\ReciprocityService;
use PHPUnit\Framework\TestCase;

final class ReciprocityServiceTest extends TestCase
{
    public function testReturnsCorrectCountsForBothSides(): void
    {
        $contact = new Contact();
        $repo = self::createStub(ContactInteractionRepository::class);

        $repo->method('countByInitiator')
            ->willReturnCallback(
                static fn (Contact $c, string $initiator): int => match ($initiator) {
                    'me' => 5,
                    'them' => 2,
                    default => 0,
                },
            );

        $result = (new ReciprocityService($repo))->getReciprocity($contact);

        self::assertSame(['me' => 5, 'them' => 2], $result);
    }

    public function testReturnsZerosWhenNoInteractions(): void
    {
        $contact = new Contact();
        $repo = self::createStub(ContactInteractionRepository::class);
        $repo->method('countByInitiator')->willReturn(0);

        $result = (new ReciprocityService($repo))->getReciprocity($contact);

        self::assertSame(['me' => 0, 'them' => 0], $result);
    }

    public function testPassesCorrect90DayThreshold(): void
    {
        $contact = new Contact();
        $capturedSince = null;

        $repo = self::createStub(ContactInteractionRepository::class);
        $repo->method('countByInitiator')
            ->willReturnCallback(
                static function (Contact $c, string $initiator, \DateTimeImmutable $since) use (&$capturedSince): int {
                    $capturedSince = $since;

                    return 0;
                },
            );

        (new ReciprocityService($repo))->getReciprocity($contact, 90);

        self::assertNotNull($capturedSince);
        $expectedThreshold = new \DateTimeImmutable('-90 days');

        // Allow 5-second tolerance for test execution time.
        self::assertEqualsWithDelta($expectedThreshold->getTimestamp(), $capturedSince->getTimestamp(), 5);
    }

    public function testRespectsCustomDaysWindow(): void
    {
        $contact = new Contact();
        $capturedSince = null;

        $repo = self::createStub(ContactInteractionRepository::class);
        $repo->method('countByInitiator')
            ->willReturnCallback(
                static function (Contact $c, string $initiator, \DateTimeImmutable $since) use (&$capturedSince): int {
                    $capturedSince = $since;

                    return 0;
                },
            );

        (new ReciprocityService($repo))->getReciprocity($contact, 30);

        self::assertNotNull($capturedSince);
        $expectedThreshold = new \DateTimeImmutable('-30 days');

        self::assertEqualsWithDelta($expectedThreshold->getTimestamp(), $capturedSince->getTimestamp(), 5);
    }
}
