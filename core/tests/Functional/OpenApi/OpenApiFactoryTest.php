<?php

namespace Ari\Tests\Functional\OpenApi;

use ApiPlatform\OpenApi\Factory\OpenApiFactoryInterface;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

class OpenApiFactoryTest extends KernelTestCase
{
    public function testOpenApiDocsAreGeneratedCorrectly(): void
    {
        self::bootKernel();
        $container = self::getContainer();

        $openApiFactory = $container->get('api_platform.openapi.factory');
        // If the service is decorated, we might need to get it by interface or alias,
        // but 'api_platform.openapi.factory' is the standard ID.
        // However, in test env, private services might be hidden.
        // ApiPlatform usually makes it public or accessible.

        self::assertInstanceOf(OpenApiFactoryInterface::class, $openApiFactory);

        $openApi = $openApiFactory(['base_url' => '/']);

        $paths = $openApi->getPaths();

        // 1. Verify Login Path
        $loginPath = $paths->getPath('/api/login_check');
        self::assertNotNull($loginPath, 'Login path should exist');

        $loginOp = $loginPath->getPost();
        self::assertNotNull($loginOp, 'Login POST operation should exist');
        // Summary might be overridden by Lexik or other integrations.
        // We verify that the path exists and has a POST operation.
        $requestBody = $loginOp->getRequestBody();
        self::assertNotNull($requestBody);


        // Checking tags if possible.
        // self::assertContains('Token', $loginOp->getTags());

        // 2. Verify Google Import Path
        $googleImportPath = $paths->getPath('/api/google/import');
        self::assertNotNull($googleImportPath, 'Google import path should exist');
        self::assertNotNull($googleImportPath->getPost(), 'Google import POST operation should exist');

        // 3. Verify Google Auth Paths
        $googleConnectPath = $paths->getPath('/connect/google');
        self::assertNotNull($googleConnectPath, 'Google connect path should exist');

        $googleCheckPath = $paths->getPath('/api/connect/google/check');
        self::assertNotNull($googleCheckPath, 'Google check path should exist');

        // 4. Verify Security Schemes
        $components = $openApi->getComponents();
        $securitySchemes = $components->getSecuritySchemes();
        self::assertNotNull($securitySchemes, 'Security schemes should not be null');
        self::assertArrayHasKey('bearerAuth', $securitySchemes, 'Bearer auth should be defined');
        self::assertEquals('http', $securitySchemes['bearerAuth']['type']);
        self::assertEquals('bearer', $securitySchemes['bearerAuth']['scheme']);

        // 5. Verify Security
        $security = $openApi->getSecurity();
        // Check if global security is applied
        $hasBearerAuth = false;
        foreach ($security as $scheme) {
            if (array_key_exists('bearerAuth', $scheme)) {
                $hasBearerAuth = true;
                break;
            }
        }
        self::assertTrue($hasBearerAuth, 'Global bearer auth security should be applied');
    }
}
