<?php

namespace App\EventListener;

use Doctrine\Bundle\DoctrineBundle\Attribute\AsDoctrineListener;
use Doctrine\DBAL\Event\ConnectionEventArgs;
use Doctrine\DBAL\Events;
use Doctrine\DBAL\Platforms\SqlitePlatform;

#[AsDoctrineListener(event: Events::postConnect)]
class SqliteForeignKeyListener
{
    public function postConnect(ConnectionEventArgs $args): void
    {
        $connection = $args->getConnection();

        if ($connection->getDatabasePlatform() instanceof SqlitePlatform) {
            $connection->executeStatement('PRAGMA foreign_keys = ON');
        }
    }
}
