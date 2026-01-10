<?php

namespace App\Service\Google;

use App\Entity\TokenStorage;
use App\Entity\User;
use App\Repository\TokenStorageRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\DependencyInjection\Attribute\Autowire;

class GoogleConnectService
{
    public function __construct(
        private readonly GoogleOAuthService $oauthService,
        private readonly TokenStorageRepository $tokenStorageRepository,
        private readonly EntityManagerInterface $entityManager,
        #[Autowire(env: 'APP_SECRET')]
        private readonly string $appSecret,
    ) {
    }

    public function generateState(User $user): string
    {
        $uuid = $user->getUuid();
        if (null === $uuid) {
            throw new \LogicException('User must have a UUID');
        }
        $signature = hash_hmac('sha256', $uuid, $this->appSecret);

        return $uuid . '.' . $signature;
    }

    public function validateState(string $state): string
    {
        $parts = explode('.', $state);
        if (2 !== count($parts)) {
            throw new \InvalidArgumentException('Invalid state format');
        }

        [$uuid, $signature] = $parts;
        $expectedSignature = hash_hmac('sha256', $uuid, $this->appSecret);

        if (!hash_equals($expectedSignature, $signature)) {
            throw new \InvalidArgumentException('Invalid state signature');
        }

        return $uuid;
    }

    public function connectUser(string $code, string $uuid): void
    {
        // Manually fetch user
        $user = $this->entityManager->getRepository(User::class)->findOneBy(['uuid' => $uuid]);

        if (null === $user) {
            throw new \InvalidArgumentException('User not found');
        }

        // Set tenant filter to allow finding existing TokenStorage records for this user
        // This is necessary because the callback request is not authenticated in the traditional sense
        // Note: Ideally we should use a specific Service to handle filter disabling/enabling but for now doing it here is acceptable as it is Logic specific.
        $this->entityManager->getFilters()->enable('tenant')->setParameter('currentTenant', (string) $user->getId());

        $tokens = $this->oauthService->getAccessToken($code);

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
            $tokens['refresh_token'] ?? $tokenStorage->getRefreshToken(),
        );
        $tokenStorage->setTokenExpiresAt(new \DateTimeImmutable(
            sprintf('+%d seconds', $tokens['expires_in']),
        ));
        $tokenStorage->setTenant($user);

        $this->entityManager->flush();
    }
}
