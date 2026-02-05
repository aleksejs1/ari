<?php

namespace Ari\Controller;

use Ari\Entity\UserPlugin;
use Ari\Service\Marketplace\PluginMarketplaceService;
use Ari\Service\Marketplace\PluginValidationException;
use Doctrine\ORM\EntityManagerInterface;
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
        private readonly EntityManagerInterface $entityManager,
    ) {}

    public function registry(): JsonResponse
    {
        $enabled = $this->marketplace->isCommunityPluginsEnabled();

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
            $data = $this->marketplace->fetchReadme($pluginId);
        } catch (\Throwable $e) {
            return $this->json(
                ['error' => $e->getMessage()],
                Response::HTTP_BAD_GATEWAY,
            );
        }

        return $this->json($data);
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

            // Cleanup UserPlugin records
            $this->entityManager->createQuery('DELETE FROM Ari\Entity\UserPlugin up WHERE up.pluginId = :pluginId')
                ->setParameter('pluginId', $pluginId)
                ->execute();
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
        if (!$this->marketplace->isCommunityPluginsEnabled()) {
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
