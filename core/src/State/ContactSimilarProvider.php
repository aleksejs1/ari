<?php

namespace Ari\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use Ari\Entity\Contact;
use Ari\Entity\ContactName;
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
        private EntityManagerInterface $entityManager,
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

        $criteria = [];
        $parameters = [];

        // 1. Surname logic
        $surname = null;
        $nameEntity = $contact->getContactNames()->first();
        if ($nameEntity instanceof ContactName) {
            $surname = $nameEntity->getFamily();
        }

        if (null !== $surname && '' !== $surname && strlen($surname) > 2) {
            $prefix = mb_substr($surname, 0, -2);
            if ('' !== $prefix) {
                $criteria[] = 'cn.family LIKE :prefix';
                $parameters['prefix'] = $prefix . '%';
            }
        }

        // 2. Organization logic
        $orgEntity = $contact->getContactOrganizations()->first();
        if ($orgEntity instanceof \Ari\Entity\ContactOrganization) {
            $orgName = $orgEntity->getName();
            if (null !== $orgName && '' !== $orgName) {
                $criteria[] = 'co.name = :orgName';
                $parameters['orgName'] = $orgName;
            }
        }

        if ([] === $criteria) {
            return [];
        }

        // 3. Exclude IDs (Self + Relations)
        $excludeIds = [$contact->getId()];

        // getContactRelations() returns both direct and reverse relations (inverted)
        foreach ($contact->getContactRelations() as $relation) {
            $person = $relation->getPerson();
            if (null !== $person) {
                $excludeIds[] = $person->getId();
            }
        }

        $qb = $this->entityManager->createQueryBuilder()
            ->select('c')
            ->from(Contact::class, 'c')
            ->leftJoin('c.contactNames', 'cn')
            ->leftJoin('c.contactOrganizations', 'co')
            ->andWhere(implode(' OR ', $criteria))
            ->andWhere('c.id NOT IN (:excludeIds)')
            ->setParameter('excludeIds', $excludeIds);

        foreach ($parameters as $key => $value) {
            $qb->setParameter($key, $value);
        }

        return $qb->getQuery()->getResult();
    }
}
