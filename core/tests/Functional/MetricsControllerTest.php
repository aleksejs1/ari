<?php

namespace Ari\Tests\Functional;

use ApiPlatform\Symfony\Bundle\Test\Client;
use Ari\Service\MetricsService;

class MetricsControllerTest extends AbstractApiTestCase
{
    protected bool $autoLogin = false;

    private const string VALID_SECRET = 'test-metrics-secret-value';

    #[\Override]
    protected function tearDown(): void
    {
        // Reset env var so subsequent tests see an empty secret (the default).
        putenv('METRICS_SECRET=');
        static::ensureKernelShutdown();
        parent::tearDown();
    }

    // -------------------------------------------------------------------------
    // Endpoint disabled (METRICS_SECRET empty)
    // -------------------------------------------------------------------------

    public function testReturns404WhenMetricsSecretIsEmpty(): void
    {
        // Default test env has no METRICS_SECRET → parameter is '' → 404
        $client = static::createClient();

        $client->request('GET', '/metrics');

        self::assertResponseStatusCodeSame(404);
    }

    // -------------------------------------------------------------------------
    // Endpoint enabled (METRICS_SECRET set) — reboot kernel to pick up new env
    // -------------------------------------------------------------------------

    public function testReturns403WhenTokenIsAbsent(): void
    {
        $client = $this->bootWithSecret();

        $client->request('GET', '/metrics');

        self::assertResponseStatusCodeSame(403);
    }

    public function testReturns403WhenTokenIsWrong(): void
    {
        $client = $this->bootWithSecret();

        $client->request('GET', '/metrics', ['headers' => ['X-Metrics-Token' => 'wrong-token']]);

        self::assertResponseStatusCodeSame(403);
    }

    public function testReturns200WithCorrectToken(): void
    {
        $client = $this->bootWithSecret();

        $client->request('GET', '/metrics', ['headers' => ['X-Metrics-Token' => self::VALID_SECRET]]);

        self::assertResponseStatusCodeSame(200);
    }

    public function testResponseContentTypeIsPrometheusText(): void
    {
        $client = $this->bootWithSecret();

        $client->request('GET', '/metrics', ['headers' => ['X-Metrics-Token' => self::VALID_SECRET]]);

        self::assertResponseHeaderSame('Content-Type', 'text/plain; version=0.0.4; charset=utf-8');
    }

    public function testResponseContainsAllExpectedMetricNames(): void
    {
        $client = $this->bootWithSecret();

        $response = $client->request('GET', '/metrics', ['headers' => ['X-Metrics-Token' => self::VALID_SECRET]]);

        $body = $response->getContent();
        self::assertStringContainsString('ari_messenger_queue_depth', $body);
        self::assertStringContainsString('ari_messenger_failed_messages', $body);
        self::assertStringContainsString('ari_ai_suggestions_total', $body);
        self::assertStringContainsString('ari_notification_delivery_total', $body);
        self::assertStringContainsString('ari_active_tenants_total', $body);
        self::assertStringContainsString('ari_new_tenants_24h', $body);
        self::assertStringContainsString('ari_failed_logins_total', $body);
    }

    public function testResponseContainsQueueDepthLabels(): void
    {
        $client = $this->bootWithSecret();

        $response = $client->request('GET', '/metrics', ['headers' => ['X-Metrics-Token' => self::VALID_SECRET]]);

        $body = $response->getContent();
        self::assertStringContainsString('ari_messenger_queue_depth{transport="async"}', $body);
        self::assertStringContainsString('ari_messenger_queue_depth{transport="ai_async"}', $body);
    }

    public function testResponseContainsHelpAndTypeLines(): void
    {
        $client = $this->bootWithSecret();

        $response = $client->request('GET', '/metrics', ['headers' => ['X-Metrics-Token' => self::VALID_SECRET]]);

        $body = $response->getContent();
        self::assertStringContainsString('# HELP ari_messenger_queue_depth', $body);
        self::assertStringContainsString('# TYPE ari_messenger_queue_depth gauge', $body);
        self::assertStringContainsString('# TYPE ari_failed_logins_total counter', $body);
    }

    // -------------------------------------------------------------------------
    // Helpers
    // -------------------------------------------------------------------------

    /**
     * Shuts down the shared kernel, sets METRICS_SECRET, then boots a fresh one.
     * Must be done before createClient() so the compiled container picks up the value.
     * Also stubs MetricsService so no real DB queries run.
     */
    private function bootWithSecret(): Client
    {
        static::ensureKernelShutdown();
        putenv('METRICS_SECRET=' . self::VALID_SECRET);
        $client = static::createClient();
        $this->mockMetrics();

        return $client;
    }

    private function mockMetrics(): void
    {
        // @phpstan-ignore staticMethod.dynamicCall
        $stub = $this->createStub(MetricsService::class);
        $stub->method('getQueueDepths')->willReturn(['default' => 0, 'ai_async' => 0]);
        $stub->method('getFailedMessageCount')->willReturn(0);
        $stub->method('getAiSuggestionStats')->willReturn([]);
        $stub->method('getNotificationDeliveryStats')->willReturn([]);
        $stub->method('getActiveTenantCount')->willReturn(1);
        $stub->method('getNewTenantCount')->willReturn(0);
        $stub->method('getFailedLoginCount')->willReturn(0);
        static::getContainer()->set(MetricsService::class, $stub);
    }
}
