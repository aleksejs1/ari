<?php

namespace Ari\ApiResource;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Post;
use Ari\Controller\DemoAccountAction;
use Symfony\Component\Serializer\Annotation\Groups;

#[ApiResource(
    shortName: 'DemoAccount',
    operations: [
        new Post(
            uriTemplate: '/demo-account',
            controller: DemoAccountAction::class,
            name: 'generate_demo_account',
            openapi: new \ApiPlatform\OpenApi\Model\Operation(
                summary: 'Generate a demo account',
                description: 'Creates a new user with password "demo" and 70 pre-populated contacts.',
                responses: [
                    '201' => new \ApiPlatform\OpenApi\Model\Response(
                        description: 'Demo account created',
                        content: new \ArrayObject([
                            'application/json' => [
                                'schema' => [
                                    'type' => 'object',
                                    'properties' => [
                                        'username' => ['type' => 'string'],
                                    ],
                                ],
                            ],
                        ]),
                    ),
                ],
            ),
            read: false,
            write: false,
            serialize: true,
            security: "is_granted('PUBLIC_ACCESS')",
        ),
    ],
    normalizationContext: ['groups' => ['demo:read']],
)]
/**
 * @psalm-suppress InvalidArgument
 */
class DemoAccount
{
    #[Groups(['demo:read'])]
    public string $username;
}
