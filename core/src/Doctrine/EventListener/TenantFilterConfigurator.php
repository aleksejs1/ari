<?php

namespace Ari\Doctrine\EventListener;

use Ari\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\EventDispatcher\Attribute\AsEventListener;
use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\HttpKernel\KernelEvents;

/**
 * Enables and configures the Doctrine TenantFilter on every HTTP request.
 *
 * CRITICAL: TenantFilter is the ONLY tenant isolation guard on list endpoints
 * (e.g. GET /api/contacts). Detail endpoints also use Symfony Voters, but list
 * endpoints have no second line of defence. Disabling this filter inside a
 * request context exposes all list endpoints to cross-tenant data leakage.
 * See ARCHITECTURE.md §1 Multi-Tenancy for the full invariant.
 */
#[AsEventListener(event: KernelEvents::REQUEST, priority: 1)]
class TenantFilterConfigurator
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private Security $security,
    ) {
    }

    public function onKernelRequest(RequestEvent $event): void
    {
        $filter = $this->entityManager->getFilters()->enable('tenant');
        $user = $this->security->getUser();
        if (!$user instanceof User) {
            $filter->setParameter('currentTenant', 'NONE');

            return;
        }

        $filter->setParameter('currentTenant', (string) $user->getId());
    }
}
