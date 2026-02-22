<?php

namespace Ari\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use Ari\Entity\AiSuggestion;
use Ari\Entity\ContactName;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;

/**
 * Handles PATCH /api/ai_suggestions/{id}.
 *
 * Accepted statuses:
 *   - "accepted": creates a new ContactName with the suggested locale, and sets the
 *     detected locale on the original ContactName. Both names are enriched in one click.
 *   - "dismissed": marks the suggestion as dismissed. It will not reappear for the same
 *     sourceHash, but will reappear if the name changes (new hash).
 *
 * @implements ProcessorInterface<AiSuggestion, AiSuggestion>
 */
final class AiSuggestionProcessor implements ProcessorInterface
{
    public function __construct(
        private readonly EntityManagerInterface $entityManager,
    ) {
    }

    #[\Override]
    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): AiSuggestion
    {
        \assert($data instanceof AiSuggestion);

        $status = $data->getStatus();
        if (!\in_array($status, ['accepted', 'dismissed'], true)) {
            throw new UnprocessableEntityHttpException('Status must be "accepted" or "dismissed".');
        }

        if ('accepted' === $status) {
            $this->handleAccepted($data);
        }

        $data->setResolvedAt(new \DateTimeImmutable());
        $this->entityManager->flush();

        return $data;
    }

    private function handleAccepted(AiSuggestion $suggestion): void
    {
        $payload = $suggestion->getPayload();

        $detectedLocale = isset($payload['detectedLocale']) && \is_string($payload['detectedLocale'])
            ? $payload['detectedLocale']
            : null;
        $suggestedLocale = isset($payload['suggestedLocale']) && \is_string($payload['suggestedLocale'])
            ? $payload['suggestedLocale']
            : null;
        $suggestedGiven = isset($payload['given']) && \is_string($payload['given'])
            ? $payload['given']
            : null;
        $suggestedFamily = isset($payload['family']) && \is_string($payload['family'])
            ? $payload['family']
            : null;

        // 1. Load the original ContactName and set its detectedLocale
        $originalName = $this->entityManager->find(ContactName::class, $suggestion->getEntityId());
        if (null === $originalName) {
            // ContactName was deleted while suggestion was pending — nothing to do
            return;
        }

        if (null === $originalName->getLocale()) {
            $originalName->setLocale($detectedLocale);
        }

        // 2. Create a new ContactName with the suggestedLocale
        $contact = $originalName->getContact();
        if (null !== $contact) {
            $newName = new ContactName($contact);
            $newName->setGiven($suggestedGiven);
            $newName->setFamily($suggestedFamily);
            $newName->setLocale($suggestedLocale);
            $this->entityManager->persist($newName);
        }
    }
}
