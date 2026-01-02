<?php

namespace App\Filter;

use ApiPlatform\Doctrine\Orm\Filter\AbstractFilter;
use ApiPlatform\Doctrine\Orm\Util\QueryNameGeneratorInterface;
use ApiPlatform\Metadata\Operation;
use Doctrine\ORM\QueryBuilder;
use Symfony\Component\PropertyInfo\Type;

final class UpcomingAnniversaryOrderFilter extends AbstractFilter
{
    #[\Override]
    protected function filterProperty(
        string $property,
        mixed $value,
        QueryBuilder $queryBuilder,
        QueryNameGeneratorInterface $queryNameGenerator,
        string $resourceClass,
        ?Operation $operation = null,
        array $context = []
    ): void {
        // Only trigger if the property is "upcomingAnniversary" and the value implies sorting (e.g. 'asc' or 'desc')
        // In API Platform, "order" filters usually come in via the "order" parameter in the context or query.
        // But AbstractFilter's filterProperty is called for *filters*, whereas OrderFilters are slightly different.
        // However, we can implement it as a filter that looks for a specific property or use the OrderFilter pattern.

        // Actually, custom OrderFilters usually extend AbstractFilter but check the 'order' context.
        // Let's check how standard OrderFilter works or just handle it here.

        // The "order" parameter is usually handled by `OrderFilter`.
        // If we want a custom sort, we can register this filter and check if the order parameter contains our key.

        if ($property !== 'upcomingAnniversary') {
            return;
        }


        $direction = strtoupper($value);
        if (!in_array($direction, ['ASC', 'DESC'], true)) {
            $direction = 'ASC'; // Default if just present
        }

        $alias = $queryBuilder->getRootAliases()[0];
        $dateField = "{$alias}.date";

        // Logic:
        // 1. Calculate if anniversary is this year or next year relative to today.
        //    Using SUBSTRING because MONTH/DAY functions are not standard DQL without extensions.
        //    Format assumes YYYY-MM-DD which is standard for Date type in Doctrine.

        $mDate = "SUBSTRING({$dateField}, 6, 2)";
        $dDate = "SUBSTRING({$dateField}, 9, 2)";
        $mNow = "SUBSTRING(CURRENT_DATE(), 6, 2)";
        $dNow = "SUBSTRING(CURRENT_DATE(), 9, 2)";

        $isNextYear = "CASE WHEN (
            $mDate > $mNow OR 
            ($mDate = $mNow AND $dDate >= $dNow)
        ) THEN 0 ELSE 1 END";

        $queryBuilder
            ->addSelect("$isNextYear AS HIDDEN is_next_year")
            ->addSelect("$mDate AS HIDDEN m")
            ->addSelect("$dDate AS HIDDEN d");

        $queryBuilder->addOrderBy('is_next_year', $direction);
        $queryBuilder->addOrderBy('m', $direction);
        $queryBuilder->addOrderBy('d', $direction);
    }

    #[\Override]
    public function getDescription(string $resourceClass): array
    {
        return [
            'upcomingAnniversary' => [
                'property' => 'upcomingAnniversary',
                'type' => 'string',
                'required' => false,
                'description' => 'Sort by upcoming anniversary date (pass asc/desc)',
            ],
        ];
    }
}
