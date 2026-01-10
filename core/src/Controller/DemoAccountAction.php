<?php

namespace App\Controller;

use App\ApiResource\DemoAccount;
use App\Service\Demo\DemoAccountService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Attribute\AsController;

#[AsController]
class DemoAccountAction extends AbstractController
{
    public function __construct(
        private DemoAccountService $demoAccountService
    ) {
    }

    public function __invoke(): JsonResponse
    {
        $user = $this->demoAccountService->generateDemoAccount();

        return new JsonResponse([
            'username' => $user->getUserIdentifier(),
        ], 201);
    }
}
