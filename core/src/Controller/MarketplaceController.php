<?php

namespace Ari\Controller;

use Ari\Entity\User;
use Ari\Service\Marketplace\PluginMarketplaceService;
use Ari\Service\Marketplace\PluginValidationException;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;


use Symfony\Component\Security\Http\Attribute\IsGranted;

#[IsGranted('ROLE_USER')]
class MarketplaceController extends AbstractController
{
    public function __construct(
        private readonly PluginMarketplaceService $marketplace,
    ) {}

    public function registry(): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        $enabled = $this->marketplace->isCommunityPluginsEnabled($user);

        if (!$enabled) {
            return $this->json(['enabled' => false, 'plugins' => []]);
        }

        try {
            $registry = $this->marketplace->fetchRegistry();
        } catch (\Throwable $e) {
            return $this->json(
                ['error' => 'Failed to fetch plugin registry: ' . $e->getMessage()],
                Response::HTTP_BAD_GATEWAY,
            );
        }

        return $this->json([
            'enabled' => true,
            'plugins' => $registry['plugins'],
        ]);
    }

    public function readme(string $pluginId): JsonResponse
    {
        $this->requireCommunityPluginsEnabled();

        try {
            $content = $this->marketplace->fetchReadme($pluginId);
        } catch (\Throwable $e) {
            return $this->json(
                ['error' => $e->getMessage()],
                Response::HTTP_BAD_GATEWAY,
            );
        }

        return $this->json(['content' => $content]);
    }

    #[IsGranted('ROLE_ADMIN')]
    public function install(Request $request): JsonResponse
    {
        $this->requireCommunityPluginsEnabled();
        $pluginId = $this->getPluginIdFromRequest($request);

        try {
            $result = $this->marketplace->installPlugin($pluginId);
        } catch (PluginValidationException $e) {
            return $this->json(
                ['success' => false, 'error' => $e->getMessage()],
                Response::HTTP_UNPROCESSABLE_ENTITY,
            );
        } catch (\RuntimeException $e) {
            return $this->json(
                ['success' => false, 'error' => $e->getMessage()],
                Response::HTTP_BAD_REQUEST,
            );
        }

        return $this->json($result);
    }

    #[IsGranted('ROLE_ADMIN')]
    public function update(Request $request): JsonResponse
    {
        $this->requireCommunityPluginsEnabled();
        $pluginId = $this->getPluginIdFromRequest($request);

        try {
            $result = $this->marketplace->updatePlugin($pluginId);
        } catch (PluginValidationException $e) {
            return $this->json(
                ['success' => false, 'error' => $e->getMessage()],
                Response::HTTP_UNPROCESSABLE_ENTITY,
            );
        } catch (\RuntimeException $e) {
            return $this->json(
                ['success' => false, 'error' => $e->getMessage()],
                Response::HTTP_BAD_REQUEST,
            );
        }

        return $this->json($result);
    }

    #[IsGranted('ROLE_ADMIN')]
    public function uninstall(Request $request): JsonResponse
    {
        $this->requireCommunityPluginsEnabled();
        $pluginId = $this->getPluginIdFromRequest($request);

        try {
            $result = $this->marketplace->uninstallPlugin($pluginId);
        } catch (\RuntimeException $e) {
            return $this->json(
                ['success' => false, 'error' => $e->getMessage()],
                Response::HTTP_BAD_REQUEST,
            );
        }

        return $this->json($result);
    }

    private function requireCommunityPluginsEnabled(): void
    {
        /** @var User $user */
        $user = $this->getUser();

        if (!$this->marketplace->isCommunityPluginsEnabled($user)) {
            throw $this->createAccessDeniedException('Community plugins are not enabled');
        }
    }

    private function getPluginIdFromRequest(Request $request): string
    {
        $data = $request->toArray();
        $pluginId = $data['pluginId'] ?? null;

        if (!is_string($pluginId) || '' === $pluginId) {
            throw $this->createNotFoundException('Missing required field: pluginId');
        }

        return $pluginId;
    }
}
