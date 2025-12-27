<?php

namespace App\OpenApi;

use ApiPlatform\OpenApi\Factory\OpenApiFactoryInterface;
use ApiPlatform\OpenApi\Model;
use ApiPlatform\OpenApi\OpenApi;
use Symfony\Component\DependencyInjection\Attribute\AsDecorator;

#[AsDecorator('api_platform.openapi.factory')]
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
            $components->withSecuritySchemes($securitySchemes)
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

        // Add /api/login_check path
        $pathItem = new Model\PathItem(
            ref: 'JWT Token',
            post: new Model\Operation(
                operationId: 'postCredentialsItem',
                tags: ['Token'],
                responses: [
                    '200' => [
                        'description' => 'Get JWT token',
                        'content' => new \ArrayObject([
                            'application/json' => [
                                'schema' => [
                                    '$ref' => '#/components/schemas/Token',
                                ],
                            ],
                        ]),
                    ],
                ],
                summary: 'Get JWT token to login.',
                requestBody: new Model\RequestBody(
                    description: 'Generate new JWT Token',
                    content: new \ArrayObject([
                        'application/json' => [
                            'schema' => [
                                '$ref' => '#/components/schemas/Credentials',
                            ],
                        ],
                    ]),
                ),
            ),
        );
        $openApi->getPaths()->addPath('/api/login_check', $pathItem);

        // Add /api/google/import path
        $googleImportPath = new Model\PathItem(
            ref: 'Google Import',
            post: new Model\Operation(
                operationId: 'importGoogleContacts',
                tags: ['Google'],
                responses: [
                    '200' => [
                        'description' => 'Contacts imported successfully',
                        'content' => new \ArrayObject([
                            'application/json' => [
                                'schema' => [
                                    'type' => 'object',
                                    'properties' => [
                                        'imported' => [
                                            'type' => 'integer',
                                            'example' => 10,
                                        ],
                                    ],
                                ],
                            ],
                        ]),
                    ],
                    '400' => [
                        'description' => 'Bad Request',
                        'content' => new \ArrayObject([
                            'application/json' => [
                                'schema' => [
                                    'type' => 'object',
                                    'properties' => [
                                        'error' => [
                                            'type' => 'string',
                                        ],
                                    ],
                                ],
                            ],
                        ]),
                    ],
                ],
                summary: 'Import contacts from Google People API.',
                description: 'Triggers an import of contacts using the stored Google OAuth token for the current user.'
            )
        );
        $openApi->getPaths()->addPath('/api/google/import', $googleImportPath);

        // Add /connect/google path
        $connectGooglePath = new Model\PathItem(
            ref: 'Google Auth Start',
            get: new Model\Operation(
                operationId: 'connectGoogleStart',
                tags: ['Google'],
                responses: [
                    '200' => [
                        'description' => 'Get Google Authorization URL',
                        'content' => new \ArrayObject([
                            'application/json' => [
                                'schema' => [
                                    'type' => 'object',
                                    'properties' => [
                                        'url' => [
                                            'type' => 'string',
                                            'example' => 'https://accounts.google.com/o/oauth2/v2/auth?...',
                                        ],
                                    ],
                                ],
                            ],
                        ]),
                    ],
                ],
                summary: 'Get Google OAuth Authorization URL.',
                description: 'Returns the URL to redirect the user to for Google authentication.'
            )
        );
        $openApi->getPaths()->addPath('/api/connect/google', $connectGooglePath);

        // Add /api/connect/google/check path
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
                        schema: ['type' => 'string']
                    ),
                ],
                responses: [
                    '200' => [
                        'description' => 'Google Auth Successful',
                        'content' => new \ArrayObject([
                            'application/json' => [
                                'schema' => [
                                    'type' => 'object',
                                    'properties' => [
                                        'success' => [
                                            'type' => 'boolean',
                                            'example' => true,
                                        ],
                                    ],
                                ],
                            ],
                        ]),
                    ],
                    '400' => [
                        'description' => 'Bad Request',
                        'content' => new \ArrayObject([
                            'application/json' => [
                                'schema' => [
                                    'type' => 'object',
                                    'properties' => [
                                        'error' => [
                                            'type' => 'string',
                                        ],
                                    ],
                                ],
                            ],
                        ]),
                    ],
                ],
                summary: 'Handle Google OAuth Callback.',
                description: 'Exchanges the authorization code for an access token and stores it.'
            )
        );
        $openApi->getPaths()->addPath('/api/connect/google/check', $connectGoogleCheckPath);

        return $openApi;
    }
}
