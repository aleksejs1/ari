<?php

namespace App\Doctrine\Filter;

use App\Security\TenantAwareInterface;
use Doctrine\ORM\Mapping\ClassMetadata;
use Doctrine\ORM\Query\Filter\SQLFilter;

final class TenantFilter extends SQLFilter
{
    #[\Override]
    public function addFilterConstraint(ClassMetadata $targetEntity, string $targetTableAlias): string
    {
        if (
            null === $targetEntity->reflClass
            || !$targetEntity->reflClass->implementsInterface(TenantAwareInterface::class)
        ) {
            return '';
        }

        if ("'NONE'" === $this->getParameter('currentTenant')) {
            return '0';
        }

        return sprintf('%s.tenant_id = %s', $targetTableAlias, $this->getParameter('currentTenant'));
    }
}
