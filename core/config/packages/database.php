<?php

use Symfony\Component\DependencyInjection\Loader\Configurator\ContainerConfigurator;

return static function (ContainerConfigurator $containerConfigurator): void {
    $envUrl = $_SERVER['DATABASE_URL'] ?? $_ENV['DATABASE_URL'] ?? null;
    
    // Respect explicit DATABASE_URL if set (and not empty)
    if ($envUrl) {
        $url = $envUrl;
    } else {
        $connection = $_SERVER['DB_CONNECTION'] ?? $_ENV['DB_CONNECTION'] ?? 'sqlite';
        
        if ($connection === 'mysql') {
            $url = sprintf(
                'mysql://%s:%s@%s:%s/%s?serverVersion=%s&charset=utf8mb4',
                $_SERVER['DB_USER'] ?? $_ENV['DB_USER'] ?? 'app',
                $_SERVER['DB_PASSWORD'] ?? $_ENV['DB_PASSWORD'] ?? '!ChangeMe!',
                $_SERVER['DB_HOST'] ?? $_ENV['DB_HOST'] ?? 'database',
                $_SERVER['DB_PORT'] ?? $_ENV['DB_PORT'] ?? '3306',
                $_SERVER['DB_NAME'] ?? $_ENV['DB_NAME'] ?? 'app',
                $_SERVER['DB_VERSION'] ?? $_ENV['DB_VERSION'] ?? '11.4.9-MariaDB'
            );
        } else {
            $url = 'sqlite:///%kernel.project_dir%/var/data.db';
        }
    }

    $containerConfigurator->parameters()->set('app.database_url', $url);
};
