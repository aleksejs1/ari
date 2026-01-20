<?php

use Symfony\Component\DependencyInjection\Loader\Configurator\ContainerConfigurator;

return static function (ContainerConfigurator $containerConfigurator): void {
    // We still access $_SERVER/$_ENV to make the decision dynamically at build time
    // without reading the values themselves into the logic if possible, 
    // but knowing if DATABASE_URL is set is crucial.
    $envUrl = $_SERVER['DATABASE_URL'] ?? $_ENV['DATABASE_URL'] ?? null;
    $connection = $_SERVER['DB_CONNECTION'] ?? $_ENV['DB_CONNECTION'] ?? 'sqlite';

    // Prioritize explicit DATABASE_URL
    if ($envUrl) {
        $param = '%env.database_url%';
    } elseif ($connection === 'mysql') {
        $param = '%env.mysql_dsn%';
    } else {
        $param = '%env.sqlite_dsn%';
    }

    $containerConfigurator->parameters()->set('app.database_url', $param);
};
