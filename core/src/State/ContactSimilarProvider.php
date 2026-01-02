<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\Entity\Contact;
use App\Entity\ContactName;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * @implements ProviderInterface<Contact>
 */
class ContactSimilarProvider implements ProviderInterface
{
    /**
     * @param ProviderInterface<object> $itemProvider
     */
    public function __construct(
        #[Autowire(service: 'api_platform.doctrine.orm.state.item_provider')]
        private ProviderInterface $itemProvider,
        private EntityManagerInterface $entityManager
    ) {
    }

    /**
     * @return iterable<Contact>|null
     */
    #[\Override]
    public function provide(Operation $operation, array $uriVariables = [], array $context = []): object|array|null
    {
        $contact = $this->itemProvider->provide($operation, $uriVariables, $context);

        if (!$contact instanceof Contact) {
            throw new NotFoundHttpException('Contact not found.');
        }

        // Get the surname (family name)
        // We take the verified "display name" logic or just the first name available?
        // The requirement says "surname of the current contact".

        $surname = null;
        // Priority to names
        $nameEntity = $contact->getContactNames()->first();
        if ($nameEntity instanceof ContactName) {
            $surname = $nameEntity->getFamily();
        }

        if (null === $surname || '' === $surname || strlen($surname) <= 2) {
             // If no surname or too short, return empty or exact matches?
             // Requirement: "beginning of surname is surname without last 2 chars"
             // If surname is "Li" (2 chars), prefix is "" (empty).
             // Returning all contacts when prefix is empty is probably not what is wanted.
             // Let's return empty list for now for safety if surname is too short to form a prefix.
             return [];
        }

        $prefix = mb_substr($surname, 0, -2);

        if ('' === $prefix) {
             return [];
        }

        $contactId = $contact->getId();
        if (null === $contactId) {
            return [];
        }

        return $this->entityManager->createQueryBuilder()
            ->select('c')
            ->from(Contact::class, 'c')
            ->innerJoin('c.contactNames', 'cn')
            ->andWhere('cn.family LIKE :prefix')
            ->andWhere('c.id != :excludeId')
            ->setParameter('prefix', $prefix . '%')
            ->setParameter('excludeId', $contactId)
            ->getQuery()
            ->getResult();
    }
}
