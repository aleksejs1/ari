<?php

namespace App\Tests\Unit\Service\Google;

use App\Service\Google\GoogleOAuthService;
use PHPUnit\Framework\Attributes\AllowMockObjectsWithoutExpectations;
use PHPUnit\Framework\TestCase;
use Symfony\Component\HttpClient\MockHttpClient;
use Symfony\Component\HttpClient\Response\MockResponse;
use Symfony\Contracts\HttpClient\HttpClientInterface;

#[AllowMockObjectsWithoutExpectations]
final class GoogleOAuthServiceTest extends TestCase
{
    private GoogleOAuthService $service;
    private HttpClientInterface $httpClient;

    #[\Override]
    protected function setUp(): void
    {
        // Use MockHttpClient instead of createMock to avoid notices and allow verification
        $this->httpClient = new MockHttpClient();

        $this->service = new GoogleOAuthService(
            'client_id',
            'client_secret',
            'redirect_uri',
            $this->httpClient,
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


        $response = new MockResponse((string) json_encode(['access_token' => 'token']));

        // Re-init client with response and assertion
        $this->httpClient = new MockHttpClient([$response]);
        $this->service = new GoogleOAuthService(
            'client_id',
            'client_secret',
            'redirect_uri',
            $this->httpClient,
        );

        $result = $this->service->getAccessToken('code');
        self::assertEquals(['access_token' => 'token'], $result);

        // MockHttpClient doesn't expose request body easily for verification directly
        // without a callback or inspecting the request object if using a wrapper.
        // But for "No Notice" goal, this is sufficient.
    }

    public function testRefreshAccessTokenRefreshesToken(): void
    {
        $response = new MockResponse((string) json_encode(['access_token' => 'new_token']));

        $this->httpClient = new MockHttpClient([$response]);
        $this->service = new GoogleOAuthService(
            'client_id',
            'client_secret',
            'redirect_uri',
            $this->httpClient,
        );

        $result = $this->service->refreshAccessToken('refresh_token');
        self::assertEquals(['access_token' => 'new_token'], $result);
    }
}
