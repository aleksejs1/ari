<?php

namespace App\Controller;

use App\Entity\TokenStorage;
use App\Entity\User;
use App\Repository\TokenStorageRepository;
use App\Service\Google\GoogleOAuthService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[IsGranted('ROLE_USER')]
#[Route('/connect/google')]
class GoogleAuthController extends AbstractController
{
    public function __construct(
        private readonly GoogleOAuthService $oauthService,
        private readonly TokenStorageRepository $tokenStorageRepository,
        private readonly EntityManagerInterface $entityManager,
    ) {
    }

    #[Route('', name: 'connect_google_start', methods: ['GET'])]
    public function connectApply(): Response
    {
        return $this->redirect($this->oauthService->getAuthorizationUrl());
    }

    #[Route('/check', name: 'connect_google_check', methods: ['GET'])]
    public function connectCheck(Request $request): Response
    {
        $code = $request->query->get('code');

        if (null === $code) {
            return $this->json(['error' => 'No code provided'], Response::HTTP_BAD_REQUEST);
        }

        try {
            $tokens = $this->oauthService->getAccessToken($code);
        } catch (\Exception $e) {
             return $this->json(
                 ['error' => 'Failed to fetch access token: ' . $e->getMessage()],
                 Response::HTTP_BAD_REQUEST
             );
        }

        /** @var User $user */
        $user = $this->getUser();

        $tokenStorage = $this->tokenStorageRepository->findOneBy(['user' => $user, 'type' => 'google']);

        if (null === $tokenStorage) {
            $tokenStorage = new TokenStorage();
            $tokenStorage->setUser($user);
            $tokenStorage->setType('google');
            $this->entityManager->persist($tokenStorage);
        }

        $accessToken = $tokens['access_token'];
        $tokenStorage->setAccessToken($accessToken);
        $tokenStorage->setRefreshToken(
            $tokens['refresh_token'] ?? $tokenStorage->getRefreshToken()
        );
        $tokenStorage->setTokenExpiresAt(new \DateTimeImmutable(
            sprintf('+%d seconds', $tokens['expires_in'])
        ));
        $tokenStorage->setTenant($user);

        $this->entityManager->flush();

        return $this->json(['success' => true]);
    }
}
