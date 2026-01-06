<?php

namespace App\Controller\Api;

use App\Entity\User;
use App\Service\ActivityManager;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Bundle\SecurityBundle\Security;

#[AsController]
class ActivityFeedController extends AbstractController
{
    public function __construct(
        private readonly ActivityManager $activityManager,
        private readonly Security $security,
    ) {
    }

    public function getUnreadCount(): JsonResponse
    {
        $user = $this->security->getUser();
        if (!$user instanceof User) {
            return new JsonResponse(['error' => 'User not found'], Response::HTTP_UNAUTHORIZED);
        }

        $count = $this->activityManager->getUnreadCount($user);

        return new JsonResponse(['count' => $count]);
    }

    public function markAsRead(Request $request): JsonResponse
    {
        $user = $this->security->getUser();
        if (!$user instanceof User) {
            return new JsonResponse(['error' => 'User not found'], Response::HTTP_UNAUTHORIZED);
        }

        $data = json_decode($request->getContent(), true);
        $ids = $data['ids'] ?? [];

        if (!is_array($ids)) {
            return new JsonResponse(['error' => 'Invalid data format'], Response::HTTP_BAD_REQUEST);
        }

        $this->activityManager->markAsRead($user, $ids);

        return new JsonResponse(null, Response::HTTP_NO_CONTENT);
    }
}
