<?php

namespace Ari\Security;

use Ari\Entity\User;
use Ari\Repository\ApiKeyRepository;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Core\Exception\CustomUserMessageAuthenticationException;
use Symfony\Component\Security\Http\Authenticator\AbstractAuthenticator;
use Symfony\Component\Security\Http\Authenticator\Passport\Badge\UserBadge;
use Symfony\Component\Security\Http\Authenticator\Passport\Passport;
use Symfony\Component\Security\Http\Authenticator\Passport\SelfValidatingPassport;

final class ApiKeyAuthenticator extends AbstractAuthenticator
{
    public const TOKEN_PREFIX = 'ari_';

    /**
     * The ApiKeyJwtBypassSubscriber moves Bearer ari_* tokens to this header
     * before Symfony security runs, so that the JWT authenticator never sees them.
     */
    private const BYPASS_HEADER = 'X-Ari-Api-Key-Token';

    public function __construct(
        private readonly ApiKeyRepository $apiKeyRepository,
    ) {
    }

    #[\Override]
    public function supports(Request $request): bool
    {
        $header = $request->headers->get(self::BYPASS_HEADER, '');

        return str_starts_with($header, 'Bearer ' . self::TOKEN_PREFIX);
    }

    #[\Override]
    public function authenticate(Request $request): Passport
    {
        $header = $request->headers->get(self::BYPASS_HEADER, '');
        $rawToken = substr($header, strlen('Bearer '));

        $hash = hash('sha256', $rawToken);
        $apiKey = $this->apiKeyRepository->findBySecretHash($hash);

        if (null === $apiKey) {
            throw new CustomUserMessageAuthenticationException('Invalid API key.');
        }

        $user = $apiKey->getTenant();
        if (!$user instanceof User) {
            throw new CustomUserMessageAuthenticationException('Invalid API key.');
        }

        // Attach the matched key to the request for later use (rate limiter, usage subscriber)
        $request->attributes->set('_api_key', $apiKey);

        // Store the resolved ApiKey on the badge so createToken() does not need
        // to recompute the hash and re-query the database (M5 fix).
        $badge = new ApiKeyBadge($rawToken);
        $badge->setApiKey($apiKey);

        return new SelfValidatingPassport(
            new UserBadge($user->getUserIdentifier(), fn () => $user),
            [$badge],
        );
    }

    #[\Override]
    public function createToken(Passport $passport, string $firewallName): TokenInterface
    {
        $user = $passport->getUser();

        /** @var ApiKeyBadge $badge */
        $badge = $passport->getBadge(ApiKeyBadge::class);

        // Retrieve the ApiKey attached during authenticate() — no second hash or DB query needed.
        $apiKey = $badge->getApiKey();
        if (null === $apiKey) {
            throw new CustomUserMessageAuthenticationException('Invalid API key.');
        }

        return new ApiKeyToken(
            $user,
            $firewallName,
            $apiKey->getId(),
            $apiKey->getName(),
            $apiKey->getSecretLastFour(),
            $apiKey->getScopes(),
            $user->getRoles(),
        );
    }

    #[\Override]
    public function onAuthenticationSuccess(Request $request, TokenInterface $token, string $firewallName): ?Response
    {
        return null; // Let the request continue
    }

    #[\Override]
    public function onAuthenticationFailure(Request $request, AuthenticationException $exception): Response
    {
        return new JsonResponse(
            ['code' => 401, 'message' => $exception->getMessageKey()],
            Response::HTTP_UNAUTHORIZED,
        );
    }
}
