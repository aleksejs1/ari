<?php

namespace App\Service;

use Symfony\Contracts\HttpClient\HttpClientInterface;

class TelegramService
{
    public function __construct(
        private readonly HttpClientInterface $httpClient,
    ) {
    }

    public function sendMessage(string $botToken, string $chatId, string $message): void
    {
        if ('fake_token' === $botToken || 'test_token' === $botToken) {
            return;
        }
        $url = sprintf('https://api.telegram.org/bot%s/sendMessage', $botToken);

        $this->httpClient->request('POST', $url, [
            'json' => [
                'chat_id' => $chatId,
                'text' => $message,
                'parse_mode' => 'HTML',
            ],
        ]);
    }
}
