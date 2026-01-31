<?php

namespace Ari\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Routing\Attribute\Route;

class PluginAssetController extends AbstractController
{
    private const ALLOWED_EXTENSIONS = ['js', 'css', 'map', 'woff', 'woff2', 'ttf', 'eot'];

    public function __construct(
        #[Autowire('%kernel.project_dir%')]
        private readonly string $projectDir,
    ) {
    }

    #[Route('/plugins/{pluginName}/{fileName}', name: 'plugin_asset', methods: ['GET'])]
    public function __invoke(string $pluginName, string $fileName): BinaryFileResponse
    {
        if (!$this->isValidPluginName($pluginName)) {
            throw new AccessDeniedHttpException('Invalid plugin name');
        }

        $extension = pathinfo($fileName, PATHINFO_EXTENSION);
        if (!in_array($extension, self::ALLOWED_EXTENSIONS, true)) {
            throw new AccessDeniedHttpException('File type not allowed');
        }

        if (!$this->isValidFileName($fileName)) {
            throw new AccessDeniedHttpException('Invalid file name');
        }

        $pluginPath = $this->projectDir . '/plugins/' . $pluginName;

        // If exact match doesn't exist, try to find it
        if (!is_dir($pluginPath)) {
            $found = false;
            $pluginsDir = $this->projectDir . '/plugins';
            if (is_dir($pluginsDir)) {
                $dirs = scandir($pluginsDir);
                if ($dirs !== false) {
                    foreach ($dirs as $dir) {
                        if ($dir === '.' || $dir === '..') {
                            continue;
                        }
                        // Try exact case-insensitive match or match ignoring hyphens (e.g. gift-plugin -> GiftPlugin)
                        if (strtolower($dir) === strtolower($pluginName) ||
                            strtolower($dir) === strtolower(str_replace('-', '', $pluginName))) {
                            $pluginPath = $pluginsDir . '/' . $dir;
                            $found = true;
                            break;
                        }
                    }
                }
            }

            if (!$found) {
                throw new NotFoundHttpException('Plugin not found');
            }
        }

        $filePath = $pluginPath . '/ui/dist/' . $fileName;

        // Re-check plugin path (though we just found it)
        if (!is_dir($pluginPath)) {
            throw new NotFoundHttpException('Plugin not found');
        }

        if (!file_exists($filePath) || !is_file($filePath)) {
            throw new NotFoundHttpException('File not found');
        }

        $realPath = realpath($filePath);
        $expectedBase = realpath($pluginPath . '/ui/dist');

        if ($realPath === false || $expectedBase === false || !str_starts_with($realPath, $expectedBase)) {
            throw new AccessDeniedHttpException('Access denied');
        }

        $response = new BinaryFileResponse($filePath);

        $response->headers->set('Access-Control-Allow-Origin', '*');
        $response->headers->set('Access-Control-Allow-Methods', 'GET, OPTIONS');

        $mimeType = $this->getMimeType($extension);
        if ($mimeType !== null) {
            $response->headers->set('Content-Type', $mimeType);
        }

        $response->setMaxAge(3600);
        $response->setPublic();

        return $response;
    }

    private function isValidPluginName(string $name): bool
    {
        return preg_match('/^[a-zA-Z0-9_-]+$/', $name) === 1;
    }

    private function isValidFileName(string $name): bool
    {
        return !str_contains($name, '..') && !str_contains($name, '/') && !str_contains($name, '\\');
    }

    private function getMimeType(string $extension): ?string
    {
        return match ($extension) {
            'js' => 'application/javascript',
            'css' => 'text/css',
            'map' => 'application/json',
            'woff' => 'font/woff',
            'woff2' => 'font/woff2',
            'ttf' => 'font/ttf',
            'eot' => 'application/vnd.ms-fontobject',
            default => null,
        };
    }
}
