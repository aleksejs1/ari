<?php

namespace Ari\Doctrine\DBAL;

use Doctrine\DBAL\Driver;
use Doctrine\DBAL\Driver\Connection;
use Doctrine\DBAL\Driver\Middleware;
use Doctrine\DBAL\Driver\Middleware\AbstractDriverMiddleware;
use Doctrine\DBAL\Platforms\SqlitePlatform;

class SqliteForeignKeyMiddleware implements Middleware
{
    #[\Override]
    public function wrap(Driver $driver): Driver
    {
        return new class ($driver) extends AbstractDriverMiddleware {
            #[\Override]
            public function connect(array $params): Connection
            {
                $connection = parent::connect($params);

                if ($this->getDatabasePlatform() instanceof SqlitePlatform) {
                    $nativeConnection = $connection->getNativeConnection();
                    if ($nativeConnection instanceof \PDO) {
                        $nativeConnection->exec('PRAGMA foreign_keys = ON');
                    }
                }

                return $connection;
            }
        };
    }
}
