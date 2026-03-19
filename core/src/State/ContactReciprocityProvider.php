<?php

declare(strict_types=1);

namespace Ari\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use Ari\ApiResource\ContactReciprocity;
use Ari\Entity\Contact;
use Ari\Service\ReciprocityService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * Provides GET /api/contacts/{id}/reciprocity.
 *
 * Tenant isolation is guaranteed by the Doctrine TenantFilter (active on all HTTP requests):
 * $em->find(Contact) returns null for contacts belonging to another tenant → 404.
 *
 * @implements ProviderInterface<ContactReciprocity>
 */
final class ContactReciprocityProvider implements ProviderInterface
{
    private const int WINDOW_DAYS = 90;

    public function __construct(
        private readonly EntityManagerInterface $em,
        private readonly ReciprocityService $reciprocityService,
    ) {
    }

    #[\Override]
    public function provide(Operation $operation, array $uriVariables = [], array $context = []): ContactReciprocity
    {
        $id = (int) ($uriVariables['id'] ?? 0);
        $contact = $this->em->find(Contact::class, $id);

        if (!$contact instanceof Contact) {
            throw new NotFoundHttpException('Contact not found.');
        }

        $ratio = $this->reciprocityService->getReciprocity($contact, self::WINDOW_DAYS);

        return new ContactReciprocity(
            id: $id,
            me: $ratio['me'],
            them: $ratio['them'],
            days: self::WINDOW_DAYS,
        );
    }
}
