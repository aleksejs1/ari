<?php

namespace Ari\Service;

use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Contracts\HttpClient\HttpClientInterface;

class TelegramService
{
    public function __construct(
        private readonly HttpClientInterface $httpClient,
        #[Autowire('%telegram_api_base_url%')]
        private readonly string $apiBaseUrl,
    ) {
    }

    public function sendMessage(string $botToken, string $chatId, string $message): void
    {
        if ('fake_token' === $botToken || 'test_token' === $botToken) {
            return;
        }
        $url = sprintf('%s/bot%s/sendMessage', $this->apiBaseUrl, $botToken);

        $this->httpClient->request('POST', $url, [
            'json' => [
                'chat_id' => $chatId,
                'text' => $message,
                'parse_mode' => 'HTML',
            ],
        ]);
    }
}
