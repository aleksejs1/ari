<?php

namespace Ari\Tests\Functional;

use Ari\Service\HealthServiceInterface;

class HealthControllerTest extends AbstractApiTestCase
{
    protected bool $autoLogin = false;

    public function testReturnsOkWithNoAuthToken(): void
    {
        $client = static::createClient();
        $this->mockHealth(['database' => 'ok', 'messenger_async' => 'ok', 'messenger_ai_async' => 'ok']);

        $response = $client->request('GET', '/api/health');

        self::assertResponseStatusCodeSame(200);
        $data = $response->toArray();
        self::assertEquals('ok', $data['status']);
        self::assertArrayHasKey('checks', $data);
    }

    public function testReturns200WithVersionWhenAllChecksOk(): void
    {
        $client = static::createClient();
        $this->mockHealth(['database' => 'ok', 'messenger_async' => 'ok', 'messenger_ai_async' => 'ok']);

        $response = $client->request('GET', '/api/health');

        self::assertResponseStatusCodeSame(200);
        $data = $response->toArray();
        self::assertEquals('ok', $data['status']);
        self::assertArrayHasKey('version', $data);
        self::assertIsString($data['version']); // value from APP_VERSION env var (defaults to 'dev')
    }

    public function testReturns200NotWhenWarnState(): void
    {
        $client = static::createClient();
        $this->mockHealth(['database' => 'ok', 'messenger_async' => 'warn', 'messenger_ai_async' => 'ok']);

        $response = $client->request('GET', '/api/health');

        // warn does not escalate to 503
        self::assertResponseStatusCodeSame(200);
        self::assertEquals('ok', $response->toArray()['status']);
    }

    public function testReturns503WhenDatabaseFails(): void
    {
        $client = static::createClient();
        $this->mockHealth(['database' => 'error', 'messenger_async' => 'ok', 'messenger_ai_async' => 'ok']);

        $response = $client->request('GET', '/api/health');

        self::assertResponseStatusCodeSame(503);
        $data = $response->toArray(false);
        self::assertEquals('degraded', $data['status']);
        self::assertArrayNotHasKey('version', $data);
    }

    public function testReturns503WhenAsyncQueueError(): void
    {
        $client = static::createClient();
        $this->mockHealth(['database' => 'ok', 'messenger_async' => 'error', 'messenger_ai_async' => 'ok']);

        $response = $client->request('GET', '/api/health');

        self::assertResponseStatusCodeSame(503);
        self::assertEquals('degraded', $response->toArray(false)['status']);
    }

    public function testReturns503WhenAiAsyncQueueError(): void
    {
        $client = static::createClient();
        $this->mockHealth(['database' => 'ok', 'messenger_async' => 'ok', 'messenger_ai_async' => 'error']);

        $response = $client->request('GET', '/api/health');

        self::assertResponseStatusCodeSame(503);
        self::assertEquals('degraded', $response->toArray(false)['status']);
    }

    public function testChecksIncludeBothMessengerTransports(): void
    {
        $client = static::createClient();
        $this->mockHealth(['database' => 'ok', 'messenger_async' => 'ok', 'messenger_ai_async' => 'warn']);

        $response = $client->request('GET', '/api/health');

        self::assertResponseStatusCodeSame(200);
        $checks = $response->toArray()['checks'];
        self::assertArrayHasKey('messenger_async', $checks);
        self::assertArrayHasKey('messenger_ai_async', $checks);
        self::assertEquals('warn', $checks['messenger_ai_async']);
    }

    public function testResponseDoesNotContainTenantData(): void
    {
        $client = static::createClient();
        $this->mockHealth(['database' => 'ok', 'messenger_async' => 'ok', 'messenger_ai_async' => 'ok']);

        $response = $client->request('GET', '/api/health');

        self::assertResponseStatusCodeSame(200);
        $body = $response->getContent();
        self::assertStringNotContainsString('tenant', $body);
        self::assertStringNotContainsString('user_id', $body);
    }

    /**
     * @param array{database: string, messenger_async: string, messenger_ai_async: string} $checks
     */
    private function mockHealth(array $checks): void
    {
        // createStub() is the correct PHPUnit API for stubs without call-count expectations.
        // @phpstan-ignore staticMethod.dynamicCall
        $stub = $this->createStub(HealthServiceInterface::class);
        $stub->method('getStatus')->willReturn($checks);
        static::getContainer()->set(HealthServiceInterface::class, $stub);
    }
}
