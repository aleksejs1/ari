<?php

namespace Ari\Controller\Api;

use Ari\Entity\NotificationChannel;
use Ari\Service\E2e\E2eSeedService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Console\Application;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Console\Input\ArrayInput;
use Symfony\Component\Console\Output\BufferedOutput;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\KernelInterface;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/e2e')]
class E2eController extends AbstractController
{
    public function __construct(
        private readonly E2eSeedService $seedService,
        private readonly KernelInterface $kernel,
        private readonly EntityManagerInterface $entityManager,
    ) {
    }

    #[Route('/reset', methods: ['POST'])]
    public function reset(): JsonResponse
    {
        $this->assertE2eMode();

        $this->seedService->seed();

        return $this->json(['status' => 'ok', 'message' => 'Database reset and re-seeded']);
    }

    #[Route('/create-user', methods: ['POST'])]
    public function createUser(Request $request): JsonResponse
    {
        $this->assertE2eMode();

        $data = $request->toArray();
        $uuid = $data['uuid'] ?? 'e2e-' . bin2hex(random_bytes(8));
        $password = $data['password'] ?? 'e2e-password';

        $result = $this->seedService->createIsolatedUser($uuid, $password);

        return $this->json([
            'status' => 'ok',
            'uuid' => $uuid,
            'password' => $password,
            'email' => $result['email'],
            'token' => $result['token'],
            'userId' => $result['userId'],
        ], 201);
    }

    #[Route('/user/{uuid}', methods: ['DELETE'])]
    public function deleteUser(string $uuid): JsonResponse
    {
        $this->assertE2eMode();

        $this->seedService->deleteUser($uuid);

        return $this->json(['status' => 'ok', 'message' => "User {$uuid} deleted"]);
    }

    #[Route('/cleanup-orphaned-users', methods: ['POST'])]
    public function cleanupOrphanedUsers(): JsonResponse
    {
        $this->assertE2eMode();

        $count = $this->seedService->cleanupOrphanedUsers();

        return $this->json(['status' => 'ok', 'deleted' => $count]);
    }

    #[Route('/exec-command', methods: ['POST'])]
    public function execCommand(Request $request): JsonResponse
    {
        $this->assertE2eMode();

        $data = $request->toArray();
        $commandName = $data['command'] ?? '';

        $allowed = [
            'ari:notification:generate',
            'ari:notification:process',
            'messenger:consume',
        ];

        if (!\in_array($commandName, $allowed, true)) {
            return $this->json(
                ['error' => "Command not allowed: {$commandName}"],
                403,
            );
        }

        // Disable tenant filter so console commands can access all data
        $filters = $this->entityManager->getFilters();
        if ($filters->isEnabled('tenant')) {
            $filters->disable('tenant');
        }

        $application = new Application($this->kernel);
        $application->setAutoExit(false);

        $input = new ArrayInput([
            'command' => $commandName,
            '--no-interaction' => true,
            ...('messenger:consume' === $commandName ? [
                'receivers' => ['async'],
                '--limit' => $data['limit'] ?? 10,
                '--time-limit' => 5,
            ] : []),
            ...('ari:notification:generate' === $commandName && isset($data['args']['date'])
                ? ['--date' => $data['args']['date']]
                : []),
        ]);

        $output = new BufferedOutput();
        $exitCode = $application->run($input, $output);

        return $this->json([
            'status' => 0 === $exitCode ? 'ok' : 'error',
            'exitCode' => $exitCode,
            'output' => $output->fetch(),
        ]);
    }

    #[Route('/verify-channel/{id}', methods: ['POST'])]
    public function verifyChannel(int $id): JsonResponse
    {
        $this->assertE2eMode();

        // Disable tenant filter so we can find channel regardless of owner
        $filters = $this->entityManager->getFilters();
        if ($filters->isEnabled('tenant')) {
            $filters->disable('tenant');
        }

        $channel = $this->entityManager->find(NotificationChannel::class, $id);
        if (!$channel instanceof NotificationChannel) {
            return $this->json(['error' => 'Channel not found'], 404);
        }

        $channel->setVerifiedAt(new \DateTimeImmutable());
        $this->entityManager->flush();

        return $this->json(['status' => 'ok']);
    }

    private function assertE2eMode(): void
    {
        if ('1' !== ($_ENV['E2E_MODE'] ?? '')) {
            throw $this->createAccessDeniedException('E2E mode is not enabled');
        }
    }
}
