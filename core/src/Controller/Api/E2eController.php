<?php

namespace Ari\Controller\Api;

use Ari\Service\E2e\E2eSeedService;
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
        ]);

        $output = new BufferedOutput();
        $exitCode = $application->run($input, $output);

        return $this->json([
            'status' => 0 === $exitCode ? 'ok' : 'error',
            'exitCode' => $exitCode,
            'output' => $output->fetch(),
        ]);
    }

    private function assertE2eMode(): void
    {
        if ('1' !== ($_ENV['E2E_MODE'] ?? '')) {
            throw $this->createAccessDeniedException('E2E mode is not enabled');
        }
    }
}
