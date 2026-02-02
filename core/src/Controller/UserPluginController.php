<?php

namespace Ari\Controller;

use Ari\Entity\User;
use Ari\Service\UserPluginService;
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
        #[Autowire('%kernel.project_dir%')]
        private string $projectDir,
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

    #[Route('/activate', name: 'api_user_plugins_activate', methods: ['POST'])]
    public function activate(Request $request): JsonResponse
    {
        $data = $request->toArray();
        $pluginId = $data['pluginId'] ?? null;

        if (!$pluginId) {
            return $this->json(['error' => 'pluginId is required'], Response::HTTP_BAD_REQUEST);
        }

        // Verify existence
        $configPath = $this->projectDir . '/plugins/' . $pluginId . '/plugin.json';
        if (!file_exists($configPath)) {
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
