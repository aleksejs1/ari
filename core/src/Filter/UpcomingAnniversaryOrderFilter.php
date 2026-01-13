<?php

namespace App\Filter;

use ApiPlatform\Doctrine\Orm\Filter\AbstractFilter;
use ApiPlatform\Doctrine\Orm\Util\QueryNameGeneratorInterface;
use ApiPlatform\Metadata\Operation;
use App\Entity\NotificationPolicy;
use App\Entity\User;
use App\Entity\UserPref;
use Doctrine\Persistence\ManagerRegistry;
use Doctrine\ORM\QueryBuilder;
use Psr\Log\LoggerInterface;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\PropertyInfo\Type;

final class UpcomingAnniversaryOrderFilter extends AbstractFilter
{
    /**
     * @param array<string, mixed>|null $properties
     */
    public function __construct(
        ManagerRegistry $managerRegistry,
        private readonly Security $security,
        ?LoggerInterface $logger = null,
        ?array $properties = null,
    ) {
        parent::__construct($managerRegistry, $logger, $properties);
    }

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
        // Only trigger if the property is "upcomingAnniversary" and the value implies sorting (e.g. 'asc' or 'desc')
        // In API Platform, "order" filters usually come in via the "order" parameter in the context or query.
        // But AbstractFilter's filterProperty is called for *filters*, whereas OrderFilters are slightly different.
        // However, we can implement it as a filter that looks for a specific property or use the OrderFilter pattern.

        // Actually, custom OrderFilters usually extend AbstractFilter but check the 'order' context.
        // Let's check how standard OrderFilter works or just handle it here.

        // The "order" parameter is usually handled by `OrderFilter`.
        // If we want a custom sort, we can register this filter and check if the order parameter contains our key.

        if ('upcomingAnniversary' !== $property) {
            return;
        }

        $this->applyPolicyFiltering($queryBuilder, $queryNameGenerator);

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
        $mNow = 'SUBSTRING(CURRENT_DATE(), 6, 2)';
        $dNow = 'SUBSTRING(CURRENT_DATE(), 9, 2)';

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

    private function applyPolicyFiltering(QueryBuilder $queryBuilder, QueryNameGeneratorInterface $queryNameGenerator): void
    {
        $user = $this->security->getUser();
        if (!$user instanceof User) {
            return;
        }

        if (null === $this->managerRegistry) {
            return;
        }

        $entityManager = $this->managerRegistry->getManagerForClass(UserPref::class);
        if (null === $entityManager) {
            return;
        }

        $pref = $entityManager->getRepository(UserPref::class)->findOneBy([
            'user' => $user,
            'type' => UserPref::TYPE_DASHBOARD_NOTIFICATION_POLICY,
        ]);

        $policyId = $pref?->getValue();
        if (null === $policyId || '' === $policyId || '0' === $policyId) {
            return;
        }

        /** @var \Doctrine\ORM\EntityManagerInterface $entityManager */
        $policy = $entityManager->getRepository(NotificationPolicy::class)->find($policyId);
        if (!$policy instanceof NotificationPolicy || $policy->getUser()?->getId() !== $user->getId()) {
            return;
        }

        $rules = $policy->getNotificationRules();
        if ($rules->isEmpty()) {
            // If policy has no rules, maybe we should show nothing? 
            // The requirement says "if pref exists, take from rules".
            // If there are no rules, then nothing matches.
            $queryBuilder->andWhere('1 = 0');

            return;
        }

        $orX = $queryBuilder->expr()->orX();
        $alias = $queryBuilder->getRootAliases()[0];

        foreach ($rules as $rule) {
            $ruleExpr = $queryBuilder->expr()->andX();
            $targetType = strtoupper((string) $rule->getTargetType());
            $eventType = $rule->getEventType();

            // 1. Target Type filtering
            if ('GROUP' === $targetType) {
                $group = $rule->getContactGroup();
                if (null === $group) {
                    continue;
                }
                $groupParam = $queryNameGenerator->generateParameterName('group');
                $queryBuilder->setParameter($groupParam, $group);
                
                $cgAlias = $queryNameGenerator->generateParameterName('cg');
                $ruleExpr->add("EXISTS (
                    SELECT 1 FROM App\Entity\ContactGroup {$cgAlias} 
                    WHERE {$cgAlias}.contact = {$alias}.contact 
                    AND {$cgAlias}.groupResource = :{$groupParam}
                )");
            } elseif ('CONTACT' === $targetType) {
                $contact = $rule->getContact();
                if (null === $contact) {
                    continue;
                }
                $contactParam = $queryNameGenerator->generateParameterName('contact');
                $queryBuilder->setParameter($contactParam, $contact);
                $ruleExpr->add("{$alias}.contact = :{$contactParam}");
            }
            // For 'ALL' targetType, we don't add extra contact/group constraints.

            // 2. Event Type filtering
            if (null !== $eventType) {
                $eventTypeParam = $queryNameGenerator->generateParameterName('eventType');
                $queryBuilder->setParameter($eventTypeParam, $eventType);
                $ruleExpr->add("LOWER({$alias}.text) = LOWER(:{$eventTypeParam})");
            }

            if ($ruleExpr->count() > 0) {
                $orX->add($ruleExpr);
            } else {
                // If it's an 'ALL' rule with no eventType, it matches everything
                // So we can return early as the whole query will match everything
                return;
            }
        }

        if ($orX->count() > 0) {
            $queryBuilder->andWhere($orX);
        } else {
            $queryBuilder->andWhere('1 = 0');
        }
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
