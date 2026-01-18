<?php

namespace App\Controller;

use App\Entity\NotificationChannel;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\UriSigner;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/public')]
class PublicNotificationController extends AbstractController
{
    public function __construct(
        private readonly UriSigner $uriSigner,
        private readonly EntityManagerInterface $entityManager,
    ) {
    }

    #[Route('/verify-channel/{id}', name: 'public_verify_channel', methods: ['GET'])]
    public function verifyChannel(Request $request, int $id): Response
    {
        // Disable tenant filter to allow anonymous access
        if ($this->entityManager->getFilters()->isEnabled('tenant')) {
            $this->entityManager->getFilters()->disable('tenant');
        }

        // 0. Manual Fetch (ParamConverter runs too early, before filter disable)
        $channel = $this->entityManager->getRepository(NotificationChannel::class)->find($id);

        if (null === $channel) {
            return new Response('Channel not found.', Response::HTTP_NOT_FOUND);
        }

        // 1. Verify Signature
        // UriSigner checks the '_hash' parameter against the full URI
        if (!$this->uriSigner->check($request->getUri())) {
            return new Response('Invalid or expired verification link.', Response::HTTP_FORBIDDEN);
        }

        // 2. Check if already verified
        if (null !== $channel->getVerifiedAt()) {
            return new Response('Channel already verified.', Response::HTTP_OK);
        }

        // 3. Mark as verified
        $channel->setVerifiedAt(new \DateTimeImmutable());
        $this->entityManager->flush();

        return new Response('Email verified successfully! You can close this window.', Response::HTTP_OK);
    }
}
