<?php

use Symfony\Component\Dotenv\Dotenv;

require dirname(__DIR__) . '/vendor/autoload.php';

(new Dotenv())->bootEnv(dirname(__DIR__) . '/.env');

if (isset($_SERVER['APP_DEBUG']) && (bool) $_SERVER['APP_DEBUG']) {
    umask(0000);
}

// Create database schema for SQLite test environment
$debugAppEnv = $_ENV['APP_ENV'] ?? $_SERVER['APP_ENV'] ?? 'null';
$debugDbUrl = $_ENV['DATABASE_URL'] ?? $_SERVER['DATABASE_URL'] ?? 'null';

fwrite(STDERR, "Checking bootstrap schema creation...\n");
fwrite(STDERR, "APP_ENV: " . $debugAppEnv . "\n");
fwrite(STDERR, "DATABASE_URL: " . $debugDbUrl . "\n");

if (
    'test' === $debugAppEnv
    && str_contains($debugDbUrl, 'sqlite://')
) {
    fwrite(STDERR, "Condition met. Initializing schema...\n");
    // If using file-based sqlite, try to remove the file to start fresh
    $dbPath = null;
    if (preg_match('#sqlite:///(.+)#', $debugDbUrl, $matches) === 1) {
        $dbPath = $matches[1];
    }
    
    if (null !== $dbPath && file_exists($dbPath)) {
        unlink($dbPath);
    }

    // Disable DAMA bundle for schema creation to allow persistence
    $_SERVER['DISABLE_DAMA_BUNDLE'] = true;

    $kernel = new \App\Kernel($debugAppEnv, (bool) ($_SERVER['APP_DEBUG'] ?? $_ENV['APP_DEBUG'] ?? false));
    $kernel->boot();

    $application = new \Symfony\Bundle\FrameworkBundle\Console\Application($kernel);
    $application->setAutoExit(false);

    $exitCode = $application->run(new \Symfony\Component\Console\Input\ArrayInput([
        'command' => 'doctrine:schema:create',
        '--no-interaction' => true,
    ]), new \Symfony\Component\Console\Output\ConsoleOutput());

    // Re-enable DAMA bundle for specific test runs if needed (though next request starts fresh kernel)
    // But PHPUnit runs in same process, so we must unset it.
    unset($_SERVER['DISABLE_DAMA_BUNDLE']);

    fwrite(STDERR, "Schema create exit code: $exitCode\n");
    if (null !== $dbPath && file_exists($dbPath)) {
        $size = filesize($dbPath);
        $sizeStr = ($size === false) ? 'unknown' : (string) $size;
        fwrite(STDERR, "DB File size: " . $sizeStr . " bytes\n");
    } else {
        fwrite(STDERR, "DB File NOT found at $dbPath\n");
    }

    $kernel->shutdown();
}
