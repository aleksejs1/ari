<?php

namespace App\Tests\Unit\Service\Google;

use App\Service\Google\GoogleOAuthService;
use PHPUnit\Framework\MockObject\MockObject;
use PHPUnit\Framework\TestCase;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use Symfony\Contracts\HttpClient\ResponseInterface;

final class GoogleOAuthServiceTest extends TestCase
{
    private GoogleOAuthService $service;
    /** @var HttpClientInterface&MockObject */
    private HttpClientInterface $httpClient;

    #[\Override]
    protected function setUp(): void
    {
        $this->httpClient = $this->createMock(HttpClientInterface::class);
        $this->service = new GoogleOAuthService(
            'client_id',
            'client_secret',
            'redirect_uri',
            $this->httpClient
        );
    }

    public function testGetAuthorizationUrlReturnsCorrectUrl(): void
    {
        $url = $this->service->getAuthorizationUrl();

        self::assertStringContainsString('https://accounts.google.com/o/oauth2/v2/auth', $url);
        self::assertStringContainsString('client_id=client_id', $url);
        self::assertStringContainsString('redirect_uri=redirect_uri', $url);
        self::assertStringContainsString('response_type=code', $url);
    }

    public function testGetAccessTokenExchangesCodeForToken(): void
    {
        $response = $this->createMock(ResponseInterface::class);
        $response->method('toArray')->willReturn(['access_token' => 'token']);

        $this->httpClient->expects(self::once())
            ->method('request')
            ->with('POST', 'https://oauth2.googleapis.com/token', self::callback(function ($options) {
                return 'code' === $options['body']['code']
                       && 'authorization_code' === $options['body']['grant_type'];
            }))
            ->willReturn($response);

        $result = $this->service->getAccessToken('code');
        self::assertEquals(['access_token' => 'token'], $result);
    }

    public function testRefreshAccessTokenRefreshesToken(): void
    {
        $response = $this->createMock(ResponseInterface::class);
        $response->method('toArray')->willReturn(['access_token' => 'new_token']);

        $this->httpClient->expects(self::once())
            ->method('request')
            ->with('POST', 'https://oauth2.googleapis.com/token', self::callback(function ($options) {
                return 'refresh_token' === $options['body']['refresh_token']
                       && 'refresh_token' === $options['body']['grant_type'];
            }))
            ->willReturn($response);

        $result = $this->service->refreshAccessToken('refresh_token');
        self::assertEquals(['access_token' => 'new_token'], $result);
    }
}
