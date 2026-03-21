<?php

namespace Ari\Repository;

use Ari\Entity\ContactPhoneNumber;
use Ari\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<ContactPhoneNumber>
 */
class ContactPhoneNumberRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ContactPhoneNumber::class);
    }

    /**
     * Build a map of normalizedPhone → contactId for all phone numbers belonging to $user.
     * Uses QueryBuilder (DQL) so the Doctrine TenantFilter and type safety apply automatically.
     * Normalization strips all non-digit characters (matching SmsBackupImportService behaviour).
     *
     * @return array<string, int>
     */
    public function buildPhoneMapForTenant(User $user): array
    {
        /** @var list<array{value: string|null, contactId: int|string}> $rows */
        $rows = $this->createQueryBuilder('cpn')
            ->select('cpn.value AS value, c.id AS contactId')
            ->join('cpn.contact', 'c')
            ->andWhere('cpn.tenant = :tenant')
            ->andWhere('c.user = :tenant') // defence-in-depth: double-check via contact owner
            ->setParameter('tenant', $user)
            ->getQuery()
            ->getScalarResult();

        $map = [];
        foreach ($rows as $row) {
            $rawValue = $row['value'] ?? '';
            if ('' === $rawValue) {
                continue;
            }
            $normalized = preg_replace('/\D/', '', $rawValue) ?? '';
            if ('' !== $normalized) {
                $map[$normalized] = (int) $row['contactId'];
            }
        }

        return $map;
    }

    /**
     * @return string[]
     */
    public function getDistinctValues(string $field): array
    {
        if (1 !== preg_match('/^[a-zA-Z_][a-zA-Z0-9_]*$/', $field)) {
            throw new \InvalidArgumentException("Invalid field name for getDistinctValues: '$field'");
        }

        return array_column(
            $this->createQueryBuilder('e')
                ->select("DISTINCT(e.$field)")
                ->where("e.$field IS NOT NULL")
                ->getQuery()
                ->getScalarResult(),
            '1',
        );
    }
}
