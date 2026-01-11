<?php

namespace App\Controller;


use App\Entity\User;
use App\Service\Google\GoogleConnectService;
use App\Service\Google\GoogleOAuthService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/connect/google')]
class GoogleAuthController extends AbstractController
{
    public function __construct(
        private readonly GoogleOAuthService $oauthService,
        private readonly GoogleConnectService $googleConnectService,
    ) {
    }

    #[IsGranted('ROLE_USER')]
    #[Route('', name: 'connect_google_start', methods: ['GET'])]
    public function connectApply(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();

        try {
            $state = $this->googleConnectService->generateState($user);
        } catch (\Exception $e) {
            return $this->json(['error' => $e->getMessage()], Response::HTTP_BAD_REQUEST);
        }

        return $this->json([
            'url' => $this->oauthService->getAuthorizationUrl($state),
        ]);
    }

    #[Route('/check', name: 'connect_google_check', methods: ['GET'])]
    public function connectCheck(Request $request): Response
    {
        $code = $request->query->get('code');
        $state = $request->query->get('state');

        if (null === $code) {
            return $this->json(['error' => 'No code provided'], Response::HTTP_BAD_REQUEST);
        }

        if (null === $state) {
            return $this->json(['error' => 'No state provided'], Response::HTTP_BAD_REQUEST);
        }

        try {
            $uuid = $this->googleConnectService->validateState($state);
            $this->googleConnectService->connectUser($code, $uuid);
        } catch (\Throwable $e) {
            return $this->json(
                ['error' => $e->getMessage()],
                Response::HTTP_BAD_REQUEST,
            );
        }

        return $this->json(['success' => true]);
    }
}
