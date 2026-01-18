<?php

namespace App\Controller;

use Gesdinet\JWTRefreshTokenBundle\Model\RefreshTokenInterface;
use Gesdinet\JWTRefreshTokenBundle\Model\RefreshTokenManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Cookie;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\AsController;

#[AsController]
class LogoutAction extends AbstractController
{
    public function __construct(
        private RefreshTokenManagerInterface $refreshTokenManager,
    ) {
    }

    public function __invoke(Request $request): Response
    {
        // 1. Try key in body
        $data = json_decode($request->getContent(), true);
        $token = $data['refresh_token'] ?? null;

        // 2. Try cookie (configured name usually 'refresh_token')
        if (null === $token || '' === $token || !is_string($token)) {
            $token = $request->cookies->get('refresh_token');
        }

        if (is_string($token) && '' !== $token) {
            $refreshToken = $this->refreshTokenManager->get($token);

            if ($refreshToken instanceof RefreshTokenInterface) {
                $this->refreshTokenManager->delete($refreshToken);
            }
        }

        $response = new JsonResponse(null, Response::HTTP_NO_CONTENT);

        // Clear the cookie just in case
        $response->headers->setCookie(new Cookie(
            'refresh_token',
            null,
            1,
            '/',
            null,
            true,
            true,
            false,
            'lax',
        ));

        return $response;
    }
}
