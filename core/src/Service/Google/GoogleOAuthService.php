<?php

namespace Ari\Service\Google;

use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Contracts\HttpClient\HttpClientInterface;

class GoogleOAuthService
{
    public function __construct(
        #[Autowire('%google_client_id%')]
        private readonly string $clientId,
        #[Autowire('%google_client_secret%')]
        private readonly string $clientSecret,
        #[Autowire('%google_redirect_uri%')]
        private readonly string $redirectUri,
        #[Autowire('%google_auth_url%')]
        private readonly string $authUrl,
        #[Autowire('%google_token_url%')]
        private readonly string $tokenUrl,
        private readonly HttpClientInterface $httpClient,
    ) {
    }

    public function getAuthorizationUrl(?string $state = null): string
    {
        $params = [
            'client_id' => $this->clientId,
            'redirect_uri' => $this->redirectUri,
            'response_type' => 'code',
            'scope' => 'https://www.googleapis.com/auth/contacts',
            'access_type' => 'offline',
            'prompt' => 'consent',
        ];

        if (null !== $state) {
            $params['state'] = $state;
        }

        return $this->authUrl . '?' . http_build_query($params);
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
        $response = $this->httpClient->request('POST', $this->tokenUrl, [
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
        $response = $this->httpClient->request('POST', $this->tokenUrl, [
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
