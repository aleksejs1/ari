<?php

namespace App\Controller;

use App\Service\Notification\TelegramWebhookService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

class TelegramWebhookController extends AbstractController
{
    #[Route('/api/webhook/telegram', name: 'webhook_telegram', methods: ['POST'])]
    public function handle(Request $request, TelegramWebhookService $webhookService): JsonResponse
    {
        $payload = json_decode($request->getContent(), true);

        if (!is_array($payload)) {
            return new JsonResponse(['status' => 'invalid payload'], 400);
        }

        $webhookService->handle($payload);

        return new JsonResponse(['status' => 'ok']);
    }
}
