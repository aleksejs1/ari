<?php

namespace App\State;

use ApiPlatform\Metadata\CollectionOperationInterface;
use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\Pagination\Pagination;
use ApiPlatform\State\Pagination\TraversablePaginator;
use ApiPlatform\State\ProviderInterface;
use App\Dto\NotificationPolicy\EventTypeDto;
use App\Entity\ContactDate;
use Doctrine\ORM\EntityManagerInterface;

/**
 * @implements ProviderInterface<EventTypeDto>
 */
class EventTypeProvider implements ProviderInterface
{
    public function __construct(
        private EntityManagerInterface $em,
        private Pagination $pagination,
    ) {
    }

    #[\Override]
    public function provide(Operation $operation, array $uriVariables = [], array $context = []): object|array|null
    {
        if (!$operation instanceof CollectionOperationInterface) {
            return null;
        }

        $filters = $context['filters'] ?? [];
        $searchText = $filters['text'] ?? $filters['search'] ?? null;

        $qb = $this->em->createQueryBuilder()
            ->select('DISTINCT cd.text as eventText')
            ->from(ContactDate::class, 'cd')
            ->where('cd.text IS NOT NULL')
            ->andWhere("cd.text != ''")
            ->orderBy('cd.text', 'ASC');

        if (null !== $searchText && '' !== $searchText) {
            $qb->andWhere('cd.text LIKE :search')
               ->setParameter('search', '%' . $searchText . '%');
        }

        $query = $qb->getQuery();

        $page = $this->pagination->getPage($context);
        $itemsPerPage = $this->pagination->getLimit($operation, $context);
        $offset = ($page - 1) * $itemsPerPage;

        $query->setFirstResult($offset);
        $query->setMaxResults($itemsPerPage);

        $results = $query->getScalarResult();

        $dtos = [];
        foreach ($results as $row) {
            $val = $row['eventText'] ?? null;
            if (is_string($val) && '' !== $val) {
                $dtos[] = new EventTypeDto($val);
            }
        }

        $countQb = $this->em->createQueryBuilder()
            ->select('COUNT(DISTINCT cd.text)')
            ->from(ContactDate::class, 'cd')
            ->where('cd.text IS NOT NULL')
            ->andWhere("cd.text != ''");

        if (null !== $searchText && '' !== $searchText) {
            $countQb->andWhere('cd.text LIKE :search')
               ->setParameter('search', '%' . $searchText . '%');
        }

        $totalItems = (int) $countQb->getQuery()->getSingleScalarResult();

        return new TraversablePaginator(
            new \ArrayIterator($dtos),
            $page,
            $itemsPerPage,
            $totalItems,
        );
    }
}
