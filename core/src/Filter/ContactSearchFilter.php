<?php

namespace App\Filter;

use ApiPlatform\Doctrine\Orm\Filter\AbstractFilter;
use ApiPlatform\Doctrine\Orm\Util\QueryNameGeneratorInterface;
use ApiPlatform\Metadata\Operation;
use Doctrine\ORM\QueryBuilder;

class ContactSearchFilter extends AbstractFilter
{
    #[\Override]
    protected function filterProperty(
        string $property,
        mixed $value,
        QueryBuilder $queryBuilder,
        QueryNameGeneratorInterface $queryNameGenerator,
        string $resourceClass,
        ?Operation $operation = null,
        array $context = [],
    ): void {
        if ('search' !== $property) {
            return;
        }

        $alias = $queryBuilder->getRootAliases()[0];
        $parameterName = $queryNameGenerator->generateParameterName('search');
        $parameterValue = strtolower((string) $value);

        $queryBuilder
            ->leftJoin(sprintf('%s.contactNames', $alias), 'cn')
            ->leftJoin(sprintf('%s.contactEmailAdresses', $alias), 'ce')
            ->leftJoin(sprintf('%s.phoneNumbers', $alias), 'cp')
            ->leftJoin(sprintf('%s.contactOrganizations', $alias), 'co')
            ->andWhere($queryBuilder->expr()->orX(
                $queryBuilder->expr()->like('LOWER(cn.given)', ':' . $parameterName),
                $queryBuilder->expr()->like('LOWER(cn.family)', ':' . $parameterName),
                $queryBuilder->expr()->like('LOWER(ce.value)', ':' . $parameterName),
                $queryBuilder->expr()->like('LOWER(cp.value)', ':' . $parameterName),
                $queryBuilder->expr()->like('LOWER(co.name)', ':' . $parameterName)
            ))
            ->setParameter($parameterName, '%' . $parameterValue . '%');
    }

    #[\Override]
    public function getDescription(string $resourceClass): array
    {
        return [
            'search' => [
                'property' => 'search',
                'type' => 'string',
                'required' => false,
                'description' => 'Search across name, email, phone number, and organization name',
            ],
        ];
    }
}
