<?php

namespace App\Doctrine\EventListener;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\EventDispatcher\Attribute\AsEventListener;

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
