<?php

use Ari\Kernel;
use Symfony\Component\Dotenv\Dotenv;

require __DIR__ . '/../vendor/autoload.php';

(new Dotenv())->bootEnv(__DIR__ . '/../.env');

/** @psalm-suppress PossiblyUndefinedArrayOffset, PossiblyNullArgument */
$kernel = new Kernel($_ENV['APP_ENV'], (bool) ($_ENV['APP_DEBUG'] ?? false));
$kernel->boot();

return $kernel->getContainer()->get('doctrine')->getManager();
