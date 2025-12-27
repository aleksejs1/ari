<?php

namespace App\Controller;

use App\Entity\User;
use App\Service\Google\GoogleContactsService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[IsGranted('ROLE_USER')]
#[Route('/api/google/import')]
class GoogleImportController extends AbstractController
{
    public function __construct(
        private readonly GoogleContactsService $googleContactsService,
    ) {
    }

    #[Route('', name: 'api_google_import', methods: ['POST'])]
    public function import(): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();

        try {
            $count = $this->googleContactsService->importContacts($user);
            return $this->json(['imported' => $count]);
        } catch (\RuntimeException $e) {
            return $this->json(['error' => $e->getMessage()], Response::HTTP_BAD_REQUEST);
        } catch (\Exception $e) {
             return $this->json(['error' => 'An unexpected error occurred.'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
