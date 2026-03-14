<?php

namespace Ari\State;

use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use Ari\Entity\ApiKey;
use Ari\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\SecurityBundle\Security;

/**
 * Handles POST (create), PATCH (update), DELETE for ApiKey.
 *
 * @implements ProcessorInterface<ApiKey, ApiKey|null>
 */
final class ApiKeyProcessor implements ProcessorInterface
{
    public const TOKEN_PREFIX = 'ari_';

    public function __construct(
        private readonly EntityManagerInterface $em,
        private readonly Security $security,
    ) {
    }

    #[\Override]
    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): mixed
    {
        if ($operation instanceof Delete) {
            $this->em->remove($data);
            $this->em->flush();

            return null;
        }

        $user = $this->security->getUser();
        if (!$user instanceof User) {
            return $data;
        }

        if (null === $data->getTenant()) {
            // New key — generate secret
            $data->setTenant($user);
            $rawToken = self::TOKEN_PREFIX . bin2hex(random_bytes(32));
            $data->setSecretHash(hash('sha256', $rawToken));
            $data->setSecretLastFour(substr($rawToken, -4));
            $data->setToken($rawToken);
        }

        $this->em->persist($data);
        $this->em->flush();

        return $data;
    }
}
