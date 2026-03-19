<?php

declare(strict_types=1);

namespace Ari\Service;

use Ari\Entity\Contact;
use Ari\Repository\ContactInteractionRepository;

/**
 * Computes the interaction reciprocity ratio for a contact over a given time window.
 *
 * "Reciprocity" is the balance between interactions initiated by the user ("me")
 * vs. interactions initiated by the contact ("them"), based on ContactInteraction.initiator.
 * Interactions with a null initiator are excluded from the count.
 */
final class ReciprocityService
{
    public function __construct(
        private readonly ContactInteractionRepository $interactionRepository,
    ) {
    }

    /**
     * Returns the interaction counts initiated by each side within the last N days.
     *
     * @return array{me: int, them: int}
     */
    public function getReciprocity(Contact $contact, int $days = 90): array
    {
        $since = new \DateTimeImmutable(sprintf('-%d days', $days));

        return [
            'me' => $this->interactionRepository->countByInitiator($contact, 'me', $since),
            'them' => $this->interactionRepository->countByInitiator($contact, 'them', $since),
        ];
    }
}
