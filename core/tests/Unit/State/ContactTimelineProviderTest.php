<?php

namespace App\Tests\Unit\State;

use ApiPlatform\Metadata\Operation;
use App\ApiResource\ContactTimeline;
use App\Entity\AuditLog;
use App\Service\ContactTimelineService;
use App\State\ContactTimelineProvider;
use Doctrine\Common\Collections\ArrayCollection;
use PHPUnit\Framework\Attributes\AllowMockObjectsWithoutExpectations;
use PHPUnit\Framework\TestCase;

#[AllowMockObjectsWithoutExpectations]
class ContactTimelineProviderTest extends TestCase
{
    public function testProvideCallsServiceAndReturnsResource(): void
    {
        $id = 123;
        $logs = new ArrayCollection([new AuditLog()]);

        $service = self::createStub(ContactTimelineService::class);
        $service->method('getTimeline')->willReturnCallback(function ($arg) use ($id, $logs) {
            if ($arg === $id) {
                return $logs;
            }

            return new ArrayCollection();
        });

        $provider = new ContactTimelineProvider($service);
        $operation = self::createStub(Operation::class);

        /** @var ContactTimeline $result */
        $result = $provider->provide($operation, ['id' => $id]);

        self::assertInstanceOf(ContactTimeline::class, $result);
        self::assertEquals($id, $result->id);
        self::assertSame($logs, $result->logs);
    }
}
