<?php

/*
 * This file is part of the API Platform project.
 *
 * (c) Kévin Dunglas <dunglas@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

declare(strict_types=1);

namespace Ari\Doctrine\Filter;

use ApiPlatform\Doctrine\Common\Filter\OrderFilterInterface;
use ApiPlatform\Doctrine\Common\Filter\OrderFilterTrait;
use ApiPlatform\Doctrine\Common\Filter\PropertyPlaceholderOpenApiParameterTrait;
use ApiPlatform\Doctrine\Orm\Filter\AbstractFilter;
use ApiPlatform\Doctrine\Orm\Util\QueryNameGeneratorInterface;
use ApiPlatform\Metadata\JsonSchemaFilterInterface;
use ApiPlatform\Metadata\OpenApiParameterFilterInterface;
use ApiPlatform\Metadata\Operation;
use ApiPlatform\Metadata\Parameter;
use Doctrine\ORM\Query\Expr\Join;
use Doctrine\ORM\QueryBuilder;
use Doctrine\Persistence\ManagerRegistry;
use Psr\Log\LoggerInterface;
use Symfony\Component\Serializer\NameConverter\NameConverterInterface;

/**
 * The order filter allows to sort a collection against the given properties.
 *
 * This is a custom implementation to fix "Using null as an array offset is deprecated" in PHP 8.
 * It is a copy of ApiPlatform\Doctrine\Orm\Filter\OrderFilter (which is final).
 */
final class SafeOrderFilter extends AbstractFilter implements OrderFilterInterface, JsonSchemaFilterInterface, OpenApiParameterFilterInterface
{
    use OrderFilterTrait;
    use PropertyPlaceholderOpenApiParameterTrait;

    /**
     * @param array<string, mixed>|null $properties
     */
    public function __construct(?ManagerRegistry $managerRegistry = null, string $orderParameterName = 'order', ?LoggerInterface $logger = null, ?array $properties = null, ?NameConverterInterface $nameConverter = null, private readonly ?string $orderNullsComparison = null)
    {
        if (null !== $properties) {
            $properties = array_map(static function ($propertyOptions) {
                // shorthand for default direction
                if (\is_string($propertyOptions)) {
                    $propertyOptions = [
                        'default_direction' => $propertyOptions,
                    ];
                }

                return $propertyOptions;
            }, $properties);
        }

        parent::__construct($managerRegistry, $logger, $properties, $nameConverter);

        $this->orderParameterName = $orderParameterName;
    }

    #[\Override]
    public function apply(QueryBuilder $queryBuilder, QueryNameGeneratorInterface $queryNameGenerator, string $resourceClass, ?Operation $operation = null, array $context = []): void
    {
        if (
            isset($context['filters'])
            && (!isset($context['filters'][$this->orderParameterName]) || !\is_array($context['filters'][$this->orderParameterName]))
            && !isset($context['parameter'])
        ) {
            return;
        }

        $parameter = $context['parameter'] ?? null;
        // Fix: check if property is null (using ternary or null coalesce) before accessing array offset
        $property = $parameter?->getProperty();
        if (null !== $property && null !== ($value = $context['filters'][$property] ?? null)) {
            /** @var class-string $resourceClassStr */
            $resourceClassStr = $resourceClass;
            $this->filterProperty($this->denormalizePropertyName($property), $value, $queryBuilder, $queryNameGenerator, $resourceClassStr, $operation, $context);

            return;
        }

        if (isset($context['filters'][$this->orderParameterName]) && is_array($context['filters'][$this->orderParameterName])) {
            foreach ($context['filters'][$this->orderParameterName] as $filterProperty => $filterValue) {
                /** @var class-string $resourceClassStr */
                $resourceClassStr = $resourceClass;
                $this->filterProperty($this->denormalizePropertyName($filterProperty), $filterValue, $queryBuilder, $queryNameGenerator, $resourceClassStr, $operation, $context);
            }
        }
    }

    #[\Override]
    protected function filterProperty(string $property, mixed $value, QueryBuilder $queryBuilder, QueryNameGeneratorInterface $queryNameGenerator, string $resourceClass, ?Operation $operation = null, array $context = []): void
    {
        if (!$this->isPropertyEnabled($property, $resourceClass) || !$this->isPropertyMapped($property, $resourceClass)) {
            return;
        }

        $direction = $this->normalizeValue($value, $property);
        if (null === $direction) {
            return;
        }

        $alias = $queryBuilder->getRootAliases()[0];
        $field = $property;

        if ($this->isPropertyNested($property, $resourceClass)) {
            [$alias, $field] = $this->addJoinsForNestedProperty($property, $alias, $queryBuilder, $queryNameGenerator, $resourceClass, Join::LEFT_JOIN);
        }

        if (null !== $nullsComparison = $this->properties[$property]['nulls_comparison'] ?? $this->orderNullsComparison) {
            $nullsDirection = self::NULLS_DIRECTION_MAP[$nullsComparison][$direction];

            $fieldSanitized = str_replace('.', '_', $field);
            if (is_array($fieldSanitized)) {
                $fieldSanitized = implode('_', $fieldSanitized);
            }
            $nullRankHiddenField = \sprintf('_%s_%s_null_rank', $alias, $fieldSanitized);

            $queryBuilder->addSelect(\sprintf('CASE WHEN %s.%s IS NULL THEN 0 ELSE 1 END AS HIDDEN %s', $alias, $field, $nullRankHiddenField));
            $queryBuilder->addOrderBy($nullRankHiddenField, $nullsDirection);
        }

        $queryBuilder->addOrderBy(\sprintf('%s.%s', $alias, $field), $direction);
    }

    /**
     * @return array<string, mixed>
     */
    #[\Override]
    public function getSchema(Parameter $parameter): array
    {
        return ['type' => 'string', 'enum' => ['asc', 'desc']];
    }
}
