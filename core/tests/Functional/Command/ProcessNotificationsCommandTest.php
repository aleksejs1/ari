<?php

namespace App\Tests\Functional\Command;

use App\Service\NotificationProcessingService;
use Symfony\Bundle\FrameworkBundle\Console\Application;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;
use Symfony\Component\Console\Tester\CommandTester;

class ProcessNotificationsCommandTest extends KernelTestCase
{
    public function testExecuteSuccess(): void
    {
        $kernel = self::bootKernel();
        $application = new Application($kernel);

        // Mock Service
        $service = $this->createMock(NotificationProcessingService::class);
        $service->expects($this->once())
            ->method('processAll');

        static::getContainer()->set(NotificationProcessingService::class, $service);

        $command = $application->find('app:process-notifications');
        $commandTester = new CommandTester($command);

        $commandTester->execute([]);
        $commandTester->assertCommandIsSuccessful();
    }

    public function testExecuteFailure(): void
    {
        $kernel = self::bootKernel();
        $application = new Application($kernel);

        // Mock Failure
        $service = $this->createMock(NotificationProcessingService::class);
        $service->expects($this->once())
            ->method('processAll')
            ->willThrowException(new \RuntimeException('Processing failed'));

        static::getContainer()->set(NotificationProcessingService::class, $service);

        $command = $application->find('app:process-notifications');
        $commandTester = new CommandTester($command);

        $commandTester->execute([]);

        self::assertEquals(1, $commandTester->getStatusCode());
        
        $output = $commandTester->getDisplay();
        self::assertStringContainsString('An error occurred while processing notifications: Processing failed', $output);
    }
}
