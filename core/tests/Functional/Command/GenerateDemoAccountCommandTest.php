<?php

namespace App\Tests\Functional\Command;

use App\Command\GenerateDemoAccountCommand;
use App\Entity\User;
use App\Service\Demo\DemoAccountService;
use Symfony\Bundle\FrameworkBundle\Console\Application;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;
use Symfony\Component\Console\Tester\CommandTester;
use Symfony\Component\Uid\Uuid;

class GenerateDemoAccountCommandTest extends KernelTestCase
{
    public function testExecuteSuccessful(): void
    {
        $kernel = self::bootKernel();
        $application = new Application($kernel);

        // Mock Service
        $demoService = $this->createMock(DemoAccountService::class);
        $user = new User();
        $user->setUuid((string) Uuid::v4());
        
        $demoService->expects($this->once())
            ->method('generateDemoAccount')
            ->willReturn($user);

        // Inject Mock using the test container
        static::getContainer()->set(DemoAccountService::class, $demoService);

        $command = $application->find('app:generate-demo-account');
        $commandTester = new CommandTester($command);

        $commandTester->execute([]);

        $commandTester->assertCommandIsSuccessful();

        $output = $commandTester->getDisplay();
        self::assertStringContainsString('Demo account generated successfully!', $output);
        self::assertStringContainsString('User UUID:', $output);
    }

    public function testExecuteFailure(): void
    {
        $kernel = self::bootKernel();
        $application = new Application($kernel);

        // Mock Service failure
        $demoService = $this->createMock(DemoAccountService::class);
        $demoService->expects($this->once())
            ->method('generateDemoAccount')
            ->willThrowException(new \Exception('Simulation error'));

        static::getContainer()->set(DemoAccountService::class, $demoService);

        $command = $application->find('app:generate-demo-account');
        $commandTester = new CommandTester($command);

        $commandTester->execute([]);

        // Expected failure
        self::assertEquals(1, $commandTester->getStatusCode());
        
        $output = $commandTester->getDisplay();
        self::assertStringContainsString('Error generating demo account: Simulation error', $output);
    }
}
