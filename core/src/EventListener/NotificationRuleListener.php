<?php

namespace Ari\EventListener;

use Ari\Entity\NotificationQueue;
use Ari\Entity\NotificationRule;
use Doctrine\Bundle\DoctrineBundle\Attribute\AsEntityListener;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Event\PreRemoveEventArgs;
use Doctrine\ORM\Events;

#[AsEntityListener(event: Events::preRemove, method: 'preRemove', entity: NotificationRule::class)]
class NotificationRuleListener
{
    public function __construct(
        private EntityManagerInterface $entityManager,
    ) {
    }

    public function preRemove(NotificationRule $rule, PreRemoveEventArgs $args): void
    {
        $queues = $this->entityManager->getRepository(NotificationQueue::class)->findBy([
            'rule' => $rule,
            'status' => 'pending',
        ]);

        foreach ($queues as $queue) {
            $queue->setStatus('canceled');
            $queue->setResult('Rule deleted');
        }
    }
}
