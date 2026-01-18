<?php

namespace App\Controller;

use App\Entity\NotificationChannel;
use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\UriSigner;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/notification_channels')]
class NotificationChannelController extends AbstractController
{
    public function __construct(
        private readonly MailerInterface $mailer,
        private readonly UriSigner $uriSigner,
        private readonly string $senderEmail = 'no-reply@personal-ari.com',
    ) {
    }

    #[Route('/{id}/verify', name: 'api_notification_channels_verify', methods: ['POST'])]
    #[IsGranted('ROLE_USER')] // Basic check, specific ownership check below
    public function verify(NotificationChannel $channel): JsonResponse
    {
        // 1. Check permissions (User must own the channel)
        /** @var User $user */
        $user = $this->getUser();
        if ($channel->getUser() !== $user) {
            throw $this->createAccessDeniedException('You do not own this channel.');
        }

        // 2. Check type
        if ('email' !== $channel->getType()) {
            return new JsonResponse(['error' => 'Only email channels can be verified this way.'], Response::HTTP_BAD_REQUEST);
        }

        // 3. Get email from config
        $config = $channel->getConfig();
        $emailAddress = $config['email'] ?? null;

        if (!is_string($emailAddress) || false === filter_var($emailAddress, FILTER_VALIDATE_EMAIL)) {
            return new JsonResponse(['error' => 'Invalid or missing email address in configuration.'], Response::HTTP_BAD_REQUEST);
        }

        // 4. Generate Signed URL
        $url = $this->generateUrl(
            'public_verify_channel', // Route name we will create in PublicNotificationController
            [
                'id' => $channel->getId(),
                'timestamp' => time(), // Add timestamp to prevent replay attacks if signature doesn't include it implicitly (UriSigner just signs query string)
            ],
            UrlGeneratorInterface::ABSOLUTE_URL,
        );

        $signedUrl = $this->uriSigner->sign($url);

        // 5. Send Email
        $email = (new Email())
            ->from($this->senderEmail)
            ->to($emailAddress)
            ->subject('Verify your Notification Channel')
            ->html(sprintf(
                '<p>Please click the link below to verify your email address for notifications:</p><p><a href="%s">%s</a></p>',
                htmlspecialchars($signedUrl),
                htmlspecialchars($signedUrl),
            ));

        $this->mailer->send($email);

        return new JsonResponse(['message' => 'Verification email sent.']);
    }
}
