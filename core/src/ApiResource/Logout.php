<?php

namespace App\ApiResource;

use ApiPlatform\Metadata\ApiProperty;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Post;
use ApiPlatform\OpenApi\Model\Operation;
use ApiPlatform\OpenApi\Model\Response;
use App\Controller\LogoutAction;
use Symfony\Component\Validator\Constraints as Assert;

#[ApiResource(
    shortName: 'Auth', // Group under Auth
    operations: [
        new Post(
            uriTemplate: '/logout',
            controller: LogoutAction::class,
            openapi: new Operation(
                summary: 'Log out (revoke refresh token)',
                description: 'Revokes the refresh token provided in the body or cookies.',
                responses: [
                    '204' => new Response(description: 'Logout successful'),
                ],
            ),
            status: 204,
            output: false,
        ),
    ],
)]
class Logout
{
    #[ApiProperty(description: 'The refresh token to revoke. If not provided, will look in cookies.')]
    #[Assert\Type('string')]
    public ?string $refresh_token = null;
}
