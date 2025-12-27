<?php

namespace App\Controller;

use App\Entity\TokenStorage;
use App\Entity\User;
use App\Repository\TokenStorageRepository;
use App\Service\Google\GoogleOAuthService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Cookie;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/connect/google')]
class GoogleAuthController extends AbstractController
{
    public function __construct(
        private readonly GoogleOAuthService $oauthService,
        private readonly TokenStorageRepository $tokenStorageRepository,
        private readonly EntityManagerInterface $entityManager,
    ) {
    }

    #[IsGranted('ROLE_USER')]
    #[Route('', name: 'connect_google_start', methods: ['GET'])]
    public function connectApply(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();

        // Generate signed state: userID.signature
        $uuid = $user->getUuid();
        if ($uuid === null) {
            throw new \LogicException('User must have a UUID');
        }
        $stateData = $uuid;
        $signature = hash_hmac('sha256', $stateData, $_ENV['APP_SECRET']);
        $state = $stateData . '.' . $signature;

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

        // Verify state
        $parts = explode('.', $state);
        if (count($parts) !== 2) {
            return $this->json(['error' => 'Invalid state format'], Response::HTTP_BAD_REQUEST);
        }

        [$uuid, $signature] = $parts;
        $expectedSignature = hash_hmac('sha256', $uuid, $_ENV['APP_SECRET']);

        if (!hash_equals($expectedSignature, $signature)) {
            return $this->json(['error' => 'Invalid state signature'], Response::HTTP_BAD_REQUEST);
        }

        // Manually fetch user
        $user = $this->entityManager->getRepository(User::class)->findOneBy(['uuid' => $uuid]);

        if (null === $user) {
            return $this->json(['error' => 'User not found'], Response::HTTP_BAD_REQUEST);
        }

        try {
            $tokens = $this->oauthService->getAccessToken($code);
        } catch (\Exception $e) {
            return $this->json(
                ['error' => 'Failed to fetch access token: ' . $e->getMessage()],
                Response::HTTP_BAD_REQUEST
            );
        }

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
