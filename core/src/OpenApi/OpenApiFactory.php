<?php

namespace App\OpenApi;

use ApiPlatform\OpenApi\Factory\OpenApiFactoryInterface;
use ApiPlatform\OpenApi\Model;
use ApiPlatform\OpenApi\OpenApi;
use Symfony\Component\DependencyInjection\Attribute\AsDecorator;

#[AsDecorator('api_platform.openapi.factory')]
/**
 * @psalm-suppress InvalidArgument
 */
class OpenApiFactory implements OpenApiFactoryInterface
{
    public function __construct(private OpenApiFactoryInterface $decorated)
    {
    }

    #[\Override]
    public function __invoke(array $context = []): OpenApi
    {
        $openApi = ($this->decorated)($context);
        $components = $openApi->getComponents();
        $securitySchemes = $components->getSecuritySchemes() ?? new \ArrayObject();

        // Add Bearer (JWT) security scheme
        $securitySchemes['bearerAuth'] = new \ArrayObject([
            'type' => 'http',
            'scheme' => 'bearer',
            'bearerFormat' => 'JWT',
        ]);

        $openApi = $openApi->withComponents(
            $components->withSecuritySchemes($securitySchemes),
        );

        // Apply the security scheme globally
        $security = $openApi->getSecurity();
        $security[] = ['bearerAuth' => []];
        $openApi = $openApi->withSecurity($security);

        // Add schemas for Login
        $schemas = $components->getSchemas() ?? new \ArrayObject();
        $schemas['Token'] = new \ArrayObject([
            'type' => 'object',
            'properties' => [
                'token' => [
                    'type' => 'string',
                    'readOnly' => true,
                ],
            ],
        ]);
        $schemas['Credentials'] = new \ArrayObject([
            'type' => 'object',
            'properties' => [
                'username' => [
                    'type' => 'string',
                    'example' => 'test-uuid-1234',
                ],
                'password' => [
                    'type' => 'string',
                    'example' => 'password',
                ],
            ],
        ]);

        // --- Helper for Login ---
        $tokenResponseContent = $this->createApiContent([
            'application/json' => new Model\MediaType(
                schema: new \ArrayObject(['$ref' => '#/components/schemas/Token'])
            ),
        ]);

        $credentialsRequestContent = $this->createApiContent([
            'application/json' => new Model\MediaType(
                schema: new \ArrayObject(['$ref' => '#/components/schemas/Credentials'])
            ),
        ]);

        // Add /api/login_check path
        $pathItem = new Model\PathItem(
            ref: 'JWT Token',
            post: new Model\Operation(
                operationId: 'postCredentialsItem',
                tags: ['Token'],
                responses: [
                    '200' => new Model\Response(
                        description: 'Get JWT token',
                        content: $tokenResponseContent,
                    ),
                ],
                summary: 'Get JWT token to login.',
                requestBody: new Model\RequestBody(
                    description: 'Generate new JWT Token',
                    content: $credentialsRequestContent,
                ),
            ),
        );
        $openApi->getPaths()->addPath('/api/login_check', $pathItem);

        // --- Helper for Google Import ---
        $googleImportResponseContent = $this->createApiContent([
            'application/json' => new Model\MediaType(
                schema: new \ArrayObject([
                    'type' => 'object',
                    'properties' => [
                        'imported' => [
                            'type' => 'integer',
                            'example' => 10,
                        ],
                    ],
                ]),
            ),
        ]);

        $googleImportErrorContent = $this->createApiContent([
            'application/json' => new Model\MediaType(
                schema: new \ArrayObject([
                    'type' => 'object',
                    'properties' => [
                        'error' => [
                            'type' => 'string',
                        ],
                    ],
                ]),
            ),
        ]);

        $googleImportRequestContent = $this->createApiContent([
            'application/json' => new Model\MediaType(
                schema: new \ArrayObject([
                    'type' => 'object',
                    'properties' => [
                        'add_google_group' => [
                            'type' => 'boolean',
                            'description' => 'If true, adds a "google" group to all imported contacts.',
                            'example' => true,
                        ],
                    ],
                ]),
            ),
        ]);

        // --- Helper for Contact XML Import ---
        $contactImportXmlRequestContent = $this->createApiContent([
            'multipart/form-data' => new Model\MediaType(
                schema: new \ArrayObject([
                    'type' => 'object',
                    'properties' => [
                        'file' => [
                            'type' => 'string',
                            'format' => 'binary',
                        ],
                    ],
                ]),
            ),
        ]);

        // Add /api/google/import path
        $googleImportPath = new Model\PathItem(
            ref: 'Google Import',
            post: new Model\Operation(
                operationId: 'importGoogleContacts',
                tags: ['Google'],
                responses: [
                    '200' => new Model\Response(
                        description: 'Contacts imported successfully',
                        content: $googleImportResponseContent,
                    ),
                    '400' => new Model\Response(
                        description: 'Bad Request',
                        content: $googleImportErrorContent,
                    ),
                ],
                summary: 'Import contacts from Google People API.',
                description: 'Triggers an import of contacts using the stored Google OAuth token for the current user.',
                requestBody: new Model\RequestBody(
                    description: 'Import options',
                    content: $googleImportRequestContent,
                ),
            ),
        );
        $openApi->getPaths()->addPath('/api/google/import', $googleImportPath);

        // Add /contacts/import-xml path
        $importXmlPath = new Model\PathItem(
            ref: 'Import XML',
            post: new Model\Operation(
                operationId: 'importContactXml',
                tags: ['Contact'],
                summary: 'Import contacts from XML',
                description: 'Upload an XML file to import contacts and groups.',
                requestBody: new Model\RequestBody(
                    content: $contactImportXmlRequestContent,
                ),
                responses: [
                    '204' => new Model\Response(
                        description: 'Contacts imported successfully',
                    ),
                    '400' => new Model\Response(
                        description: 'Bad Request',
                    ),
                ],
            ),
        );
        $openApi->getPaths()->addPath('/api/contacts/import-xml', $importXmlPath);

        // --- Helper for Google Auth Start ---
        $googleAuthStartContent = $this->createApiContent([
            'application/json' => new Model\MediaType(
                schema: new \ArrayObject([
                    'type' => 'object',
                    'properties' => [
                        'url' => [
                            'type' => 'string',
                            'example' => 'https://accounts.google.com/o/oauth2/v2/auth?...',
                        ],
                    ],
                ]),
            ),
        ]);

        // Add /connect/google path
        $connectGooglePath = new Model\PathItem(
            ref: 'Google Auth Start',
            get: new Model\Operation(
                operationId: 'connectGoogleStart',
                tags: ['Google'],
                responses: [
                    '200' => new Model\Response(
                        description: 'Get Google Authorization URL',
                        content: $googleAuthStartContent,
                    ),
                ],
                summary: 'Get Google OAuth Authorization URL.',
                description: 'Returns the URL to redirect the user to for Google authentication.',
            ),
        );
        $openApi->getPaths()->addPath('/connect/google', $connectGooglePath);

        // --- Helper for Google Auth Check ---
        $googleAuthCheckSuccessContent = $this->createApiContent([
            'application/json' => new Model\MediaType(
                schema: new \ArrayObject([
                    'type' => 'object',
                    'properties' => [
                        'success' => [
                            'type' => 'boolean',
                            'example' => true,
                        ],
                    ],
                ]),
            ),
        ]);

        $googleAuthCheckErrorContent = $this->createApiContent([
            'application/json' => new Model\MediaType(
                schema: new \ArrayObject([
                    'type' => 'object',
                    'properties' => [
                        'error' => [
                            'type' => 'string',
                        ],
                    ],
                ]),
            ),
        ]);

        // Add /connect/google/check path
        $connectGoogleCheckPath = new Model\PathItem(
            ref: 'Google Auth Check',
            get: new Model\Operation(
                operationId: 'connectGoogleCheck',
                tags: ['Google'],
                parameters: [
                    new Model\Parameter(
                        name: 'code',
                        in: 'query',
                        description: 'The authorization code returned by Google',
                        required: true,
                        schema: ['type' => 'string'],
                    ),
                ],
                responses: [
                    '200' => new Model\Response(
                        description: 'Google Auth Successful',
                        content: $googleAuthCheckSuccessContent,
                    ),
                    '400' => new Model\Response(
                        description: 'Bad Request',
                        content: $googleAuthCheckErrorContent,
                    ),
                ],
                summary: 'Handle Google OAuth Callback.',
                description: 'Exchanges the authorization code for an access token and stores it.',
            ),
        );
        $openApi->getPaths()->addPath('/api/connect/google/check', $connectGoogleCheckPath);

        return $openApi;
    }
    /**
     * @param array<string, mixed> $content
     * @return \ArrayObject<array-key, mixed>
     * @psalm-suppress InvalidReturnStatement,InvalidReturnType
     */
    private function createApiContent(array $content): \ArrayObject
    {
        return new \ArrayObject($content);
    }
}
