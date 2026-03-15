<?php

declare(strict_types=1);

namespace Ari\Repository;

use Ari\Entity\ContactDate;
use Ari\Entity\ContactEmailAdress;
use Ari\Entity\ContactName;
use Ari\Entity\ContactPhoneNumber;
use Ari\Entity\User;
use Doctrine\ORM\EntityManagerInterface;

/**
 * A plain service (not a Doctrine entity repository) that fetches distinct
 * display-option values (locales, types, texts) for a given tenant.
 * Queries explicitly filter by tenant rather than relying on the TenantFilter.
 */
final readonly class ContactDisplayOptionsRepository
{
    public function __construct(
        private EntityManagerInterface $em,
    ) {
    }

    /**
     * Returns distinct, non-empty name locales for the tenant, sorted alphabetically.
     *
     * @return string[]
     */
    public function getDistinctNameLocales(User $tenant): array
    {
        /** @var list<array{locale: string}> $rows */
        $rows = $this->em
            ->createQuery(
                'SELECT DISTINCT n.locale FROM ' . ContactName::class . ' n
                 WHERE n.tenant = :tenant
                   AND n.locale IS NOT NULL
                   AND n.locale != \'\'',
            )
            ->setParameter('tenant', $tenant)
            ->getArrayResult();

        $values = array_column($rows, 'locale');
        sort($values);

        return $values;
    }

    /**
     * Returns distinct, non-empty phone types for the tenant, sorted alphabetically.
     *
     * @return string[]
     */
    public function getDistinctPhoneTypes(User $tenant): array
    {
        /** @var list<array{type: string}> $rows */
        $rows = $this->em
            ->createQuery(
                'SELECT DISTINCT p.type FROM ' . ContactPhoneNumber::class . ' p
                 WHERE p.tenant = :tenant
                   AND p.type IS NOT NULL
                   AND p.type != \'\'',
            )
            ->setParameter('tenant', $tenant)
            ->getArrayResult();

        $values = array_column($rows, 'type');
        sort($values);

        return $values;
    }

    /**
     * Returns distinct, non-empty email types for the tenant, sorted alphabetically.
     *
     * @return string[]
     */
    public function getDistinctEmailTypes(User $tenant): array
    {
        /** @var list<array{type: string}> $rows */
        $rows = $this->em
            ->createQuery(
                'SELECT DISTINCT e.type FROM ' . ContactEmailAdress::class . ' e
                 WHERE e.tenant = :tenant
                   AND e.type IS NOT NULL
                   AND e.type != \'\'',
            )
            ->setParameter('tenant', $tenant)
            ->getArrayResult();

        $values = array_column($rows, 'type');
        sort($values);

        return $values;
    }

    /**
     * Returns distinct, non-empty date texts for the tenant, sorted alphabetically.
     *
     * @return string[]
     */
    public function getDistinctDateTexts(User $tenant): array
    {
        /** @var list<array{text: string}> $rows */
        $rows = $this->em
            ->createQuery(
                'SELECT DISTINCT d.text FROM ' . ContactDate::class . ' d
                 WHERE d.tenant = :tenant
                   AND d.text IS NOT NULL
                   AND d.text != \'\'',
            )
            ->setParameter('tenant', $tenant)
            ->getArrayResult();

        $values = array_column($rows, 'text');
        sort($values);

        return $values;
    }
}
