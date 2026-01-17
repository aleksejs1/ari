<?php

namespace App\Tests\Functional\Command;

use App\Command\ProcessNotificationQueueCommand;
use App\Service\Notification\NotificationProcessor;
use Symfony\Bundle\FrameworkBundle\Console\Application;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;
use Symfony\Component\Console\Tester\CommandTester;

class ProcessNotificationQueueCommandTest extends KernelTestCase
{
    public function testExecuteProcessedItems(): void
    {
        $kernel = self::bootKernel();
        $application = new Application($kernel);

        // Mock Processor
        $processor = $this->createMock(NotificationProcessor::class);
        $processor->expects($this->once())
            ->method('process')
            ->willReturn(5); // 5 items processed

        static::getContainer()->set(NotificationProcessor::class, $processor);

        $command = $application->find('ari:notification:process');
        $commandTester = new CommandTester($command);

        $commandTester->execute([]);

        $commandTester->assertCommandIsSuccessful();
        $output = $commandTester->getDisplay();
        self::assertStringContainsString('Processed 5 notification(s).', $output);
    }

    public function testExecuteNoItems(): void
    {
        $kernel = self::bootKernel();
        $application = new Application($kernel);

        $processor = $this->createMock(NotificationProcessor::class);
        $processor->expects($this->once())
            ->method('process')
            ->willReturn(0);

        static::getContainer()->set(NotificationProcessor::class, $processor);

        $command = $application->find('ari:notification:process');
        $commandTester = new CommandTester($command);

        $commandTester->execute([]);

        $commandTester->assertCommandIsSuccessful();
        $output = $commandTester->getDisplay();
        self::assertStringContainsString('No pending notifications found.', $output);
    }
}
