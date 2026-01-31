<?php

namespace Ari\Tests\Functional\Controller;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;

class LogoutActionTest extends ApiTestCase
{
    protected static ?bool $alwaysBootKernel = true;

    public function testLogoutClearsCookie(): void
    {
        $client = static::createClient();

        $client->request('POST', '/api/logout', [
            'json' => ['refresh_token' => 'some_token'],
        ]);

        self::assertResponseIsSuccessful();
        self::assertResponseStatusCodeSame(204);

        // Use KernelBrowser to get the underlying Symfony Response which has public 'headers' property
        /** @psalm-suppress InternalMethod */
        $symfonyResponse = $client->getKernelBrowser()->getResponse();
        self::assertInstanceOf(\Symfony\Component\HttpFoundation\Response::class, $symfonyResponse);

        $cookies = $symfonyResponse->headers->getCookies();
        // $cookies is array of Cookie objects

        $refreshTokenDeleted = false;
        foreach ($cookies as $cookie) {
            // Cookie object has getName(), getValue()
            if ('refresh_token' === $cookie->getName()) {
                $val = $cookie->getValue();
                if ('' === $val || null === $val || 'deleted' === $val) {
                    $refreshTokenDeleted = true;
                }
                break;
            }
        }

        self::assertTrue($refreshTokenDeleted, 'Refresh token cookie should be cleared');
    }
}
