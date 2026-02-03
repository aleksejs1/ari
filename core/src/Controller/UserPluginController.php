<?php

namespace Ari\Controller;

use Ari\Entity\User;
use Ari\Service\UserPluginService;
use Ari\Service\Marketplace\PluginMarketplaceService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\DependencyInjection\Attribute\Autowire;

#[Route('/api/user-plugins')]
#[IsGranted('ROLE_USER')]
class UserPluginController extends AbstractController
{
    public function __construct(
        private UserPluginService $userPluginService,
        private PluginMarketplaceService $marketplaceService,
    ) {}

    #[Route('', name: 'api_user_plugins_list', methods: ['GET'])]
    public function list(): JsonResponse
    {
        $user = $this->getUser();
        if (!$user instanceof User) {
            return $this->json(['error' => 'Unauthorized'], Response::HTTP_UNAUTHORIZED);
        }

        $plugins = $this->userPluginService->getPluginsForUser($user);

        $data = array_map(fn($p) => [
            'pluginId' => $p->getPluginId(),
            'enabled' => $p->isEnabled(),
            'activatedAt' => $p->getActivatedAt()->format(\DateTimeInterface::ATOM),
        ], $plugins);

        return $this->json($data);
    }

    #[Route('/available', name: 'api_user_plugins_available', methods: ['GET'])]
    public function available(): JsonResponse
    {
        $user = $this->getUser();
        if (!$user instanceof User) {
            return $this->json(['error' => 'Unauthorized'], Response::HTTP_UNAUTHORIZED);
        }

        // 1. Get all installed plugins on disk
        $installed = $this->marketplaceService->getInstalledPlugins();

        // 2. Get user's activation status
        $userPlugins = $this->userPluginService->getPluginsForUser($user);
        $userPluginMap = [];
        foreach ($userPlugins as $up) {
            $userPluginMap[$up->getPluginId()] = $up->isEnabled();
        }

        // 3. Merge
        $data = array_map(fn($p) => [
            'pluginId' => $p['id'] ?? $p['name'], // Fallback if ID invalid
            'name' => $p['name'], // Display Name usually in 'title' or 'description'? Manifest has 'name' as ID usually.
            'title' => $p['title'] ?? $p['name'],
            'description' => $p['description'] ?? '',
            'version' => $p['version'] ?? '',
            'enabled' => $userPluginMap[$p['id'] ?? $p['name']] ?? false,
        ], $installed);

        return $this->json($data);
    }

    #[Route('/activate', name: 'api_user_plugins_activate', methods: ['POST'])]
    public function activate(Request $request): JsonResponse
    {
        $data = $request->toArray();
        $pluginId = $data['pluginId'] ?? null;

        if (!$pluginId) {
            return $this->json(['error' => 'pluginId is required'], Response::HTTP_BAD_REQUEST);
        }

        // Verify existence via service (handles directory name vs ID mismatch)
        $pluginDir = $this->marketplaceService->findInstalledPluginDir($pluginId);

        if ($pluginDir === null) {
            return $this->json(['error' => 'Plugin not found'], Response::HTTP_NOT_FOUND);
        }

        $user = $this->getUser();
        if (!$user instanceof User) {
            return $this->json(['error' => 'Unauthorized'], Response::HTTP_UNAUTHORIZED);
        }

        $this->userPluginService->activatePlugin($user, $pluginId);

        return $this->json(['success' => true]);
    }

    #[Route('/deactivate', name: 'api_user_plugins_deactivate', methods: ['POST'])]
    public function deactivate(Request $request): JsonResponse
    {
        $data = $request->toArray();
        $pluginId = $data['pluginId'] ?? null;

        if (!$pluginId) {
            return $this->json(['error' => 'pluginId is required'], Response::HTTP_BAD_REQUEST);
        }

        $user = $this->getUser();
        if (!$user instanceof User) {
            return $this->json(['error' => 'Unauthorized'], Response::HTTP_UNAUTHORIZED);
        }

        $this->userPluginService->deactivatePlugin($user, $pluginId);

        return $this->json(['success' => true]);
    }
}
