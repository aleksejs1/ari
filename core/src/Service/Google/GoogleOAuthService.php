<?php

namespace App\Service\Google;

use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Contracts\HttpClient\HttpClientInterface;

class GoogleOAuthService
{
    private const AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
    private const TOKEN_URL = 'https://oauth2.googleapis.com/token';

    public function __construct(
        #[Autowire(env: 'GOOGLE_CLIENT_ID')]
        private readonly string $clientId,
        #[Autowire(env: 'GOOGLE_CLIENT_SECRET')]
        private readonly string $clientSecret,
        #[Autowire(env: 'GOOGLE_REDIRECT_URI')]
        private readonly string $redirectUri,
        private readonly HttpClientInterface $httpClient,
    ) {
    }

    public function getAuthorizationUrl(?string $state = null): string
    {
        $params = [
            'client_id' => $this->clientId,
            'redirect_uri' => $this->redirectUri,
            'response_type' => 'code',
            'scope' => 'https://www.googleapis.com/auth/contacts.readonly',
            'access_type' => 'offline',
            'prompt' => 'consent',
        ];

        if ($state !== null) {
            $params['state'] = $state;
        }

        return self::AUTH_URL . '?' . http_build_query($params);
    }

    /**
     * @return array{
     *     access_token: string,
     *     expires_in: int,
     *     refresh_token?: string,
     *     scope: string,
     *     token_type: string,
     *     id_token?: string
     * }
     */
    public function getAccessToken(string $code): array
    {
        $response = $this->httpClient->request('POST', self::TOKEN_URL, [
            'body' => [
                'code' => $code,
                'client_id' => $this->clientId,
                'client_secret' => $this->clientSecret,
                'redirect_uri' => $this->redirectUri,
                'grant_type' => 'authorization_code',
            ],
        ]);

        /**
         * @var array{
         *     access_token: string,
         *     expires_in: int,
         *     refresh_token?: string,
         *     scope: string,
         *     token_type: string,
         *     id_token?: string
         * } $data
         */
        $data = $response->toArray();

        return $data;
    }

    /**
     * @return array{access_token: string, expires_in: int, scope: string, token_type: string, id_token?: string}
     */
    public function refreshAccessToken(string $refreshToken): array
    {
        $response = $this->httpClient->request('POST', self::TOKEN_URL, [
            'body' => [
                'refresh_token' => $refreshToken,
                'client_id' => $this->clientId,
                'client_secret' => $this->clientSecret,
                'grant_type' => 'refresh_token',
            ],
        ]);

        /**
         * @var array{
         *     access_token: string,
         *     expires_in: int,
         *     scope: string,
         *     token_type: string,
         *     id_token?: string
         * } $data
         */
        $data = $response->toArray();

        return $data;
    }
}
