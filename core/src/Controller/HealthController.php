<?php

namespace Ari\Controller;

use Ari\Service\HealthServiceInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class HealthController extends AbstractController
{
    public function __construct(
        private readonly HealthServiceInterface $healthService,
        #[Autowire('%app_version%')]
        private readonly string $appVersion,
    ) {}

    #[Route('/api/health', name: 'api_health', methods: ['GET'])]
    public function health(): JsonResponse
    {
        $checks = $this->healthService->getStatus();
        $hasError = \in_array('error', $checks, true);

        if ($hasError) {
            return $this->json(
                ['status' => 'degraded', 'checks' => $checks],
                Response::HTTP_SERVICE_UNAVAILABLE,
            );
        }

        return $this->json([
            'status' => 'ok',
            'checks' => $checks,
            'version' => $this->appVersion,
        ]);
    }
}
