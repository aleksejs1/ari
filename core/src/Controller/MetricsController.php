<?php

namespace Ari\Controller;

use Ari\Service\MetricsService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class MetricsController extends AbstractController
{
    public function __construct(
        private readonly MetricsService $metricsService,
        #[Autowire('%metrics_secret%')]
        private readonly string $metricsSecret,
    ) {}

    /**
     * Prometheus metrics endpoint.
     *
     * Returns 404 when METRICS_SECRET is empty (feature disabled).
     * Returns 403 when the X-Metrics-Token header does not match METRICS_SECRET.
     * Returns 200 with Prometheus text format on success.
     */
    #[Route('/metrics', name: 'metrics', methods: ['GET'])]
    public function metrics(Request $request): Response
    {
        if ($this->metricsSecret === '') {
            throw $this->createNotFoundException('Metrics endpoint is disabled. Set METRICS_SECRET to enable it.');
        }

        // Accept token via X-Metrics-Token (curl/manual) or Authorization: Bearer (Prometheus).
        $token = $request->headers->get('X-Metrics-Token')
            ?? $this->parseBearerToken($request->headers->get('Authorization', ''));
        if (!hash_equals($this->metricsSecret, $token ?? '')) {
            return new Response('Forbidden', Response::HTTP_FORBIDDEN);
        }

        return new Response(
            $this->buildPrometheusOutput(),
            Response::HTTP_OK,
            ['Content-Type' => 'text/plain; version=0.0.4; charset=utf-8'],
        );
    }

    private function parseBearerToken(string $header): ?string
    {
        if (str_starts_with($header, 'Bearer ')) {
            return substr($header, 7);
        }

        return null;
    }

    private function buildPrometheusOutput(): string
    {
        $lines = [];

        // ari_messenger_queue_depth
        $lines[] = '# HELP ari_messenger_queue_depth Number of pending messages in Symfony Messenger queues.';
        $lines[] = '# TYPE ari_messenger_queue_depth gauge';
        $depths = $this->metricsService->getQueueDepths();
        foreach (['default' => 'async', 'ai_async' => 'ai_async'] as $queueName => $transportLabel) {
            $lines[] = sprintf('ari_messenger_queue_depth{transport="%s"} %d', $transportLabel, $depths[$queueName] ?? 0);
        }

        // ari_messenger_failed_messages
        $lines[] = '';
        $lines[] = '# HELP ari_messenger_failed_messages Current number of messages in the Messenger dead-letter queue.';
        $lines[] = '# TYPE ari_messenger_failed_messages gauge';
        $lines[] = sprintf('ari_messenger_failed_messages{transport="failed"} %d', $this->metricsService->getFailedMessageCount());

        // ari_ai_suggestions_total
        $lines[] = '';
        $lines[] = '# HELP ari_ai_suggestions_total Current count of AI suggestions by status and provider.';
        $lines[] = '# TYPE ari_ai_suggestions_total gauge';
        foreach ($this->metricsService->getAiSuggestionStats() as $stat) {
            $lines[] = sprintf(
                'ari_ai_suggestions_total{status="%s",provider="%s"} %d',
                $stat['status'],
                $stat['provider'],
                $stat['count'],
            );
        }

        // ari_notification_delivery_total
        $lines[] = '';
        $lines[] = '# HELP ari_notification_delivery_total Current count of notification deliveries by channel and result.';
        $lines[] = '# TYPE ari_notification_delivery_total gauge';
        foreach ($this->metricsService->getNotificationDeliveryStats() as $stat) {
            $lines[] = sprintf(
                'ari_notification_delivery_total{channel="%s",result="%s"} %d',
                $stat['channel'],
                $stat['result'],
                $stat['count'],
            );
        }

        // ari_active_tenants_total
        $lines[] = '';
        $lines[] = '# HELP ari_active_tenants_total Number of tenants with activity in the last 24 hours.';
        $lines[] = '# TYPE ari_active_tenants_total gauge';
        $lines[] = sprintf('ari_active_tenants_total %d', $this->metricsService->getActiveTenantCount());

        // ari_new_tenants_24h
        $lines[] = '';
        $lines[] = '# HELP ari_new_tenants_24h Number of new tenants registered in the last 24 hours.';
        $lines[] = '# TYPE ari_new_tenants_24h gauge';
        $lines[] = sprintf('ari_new_tenants_24h %d', $this->metricsService->getNewTenantCount());

        // ari_failed_logins_total
        $lines[] = '';
        $lines[] = '# HELP ari_failed_logins_total Cumulative count of failed login attempts.';
        $lines[] = '# TYPE ari_failed_logins_total counter';
        $lines[] = sprintf('ari_failed_logins_total %d', $this->metricsService->getFailedLoginCount());

        $lines[] = '';

        return implode("\n", $lines);
    }
}
