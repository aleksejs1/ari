<?php

declare(strict_types=1);

namespace Ari\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use Ari\Entity\Contact;
use Ari\Entity\ContactPlaybook;
use Ari\Repository\ContactPlaybookRepository;
use Ari\Repository\ContactRepository;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * Resolves the active ContactPlaybook for GET/PATCH/DELETE /api/contacts/{contactId}/playbook.
 *
 * @implements ProviderInterface<ContactPlaybook>
 */
final readonly class ContactPlaybookProvider implements ProviderInterface
{
    public function __construct(
        private ContactRepository $contactRepository,
        private ContactPlaybookRepository $playbookRepository,
    ) {
    }

    #[\Override]
    public function provide(Operation $operation, array $uriVariables = [], array $context = []): ContactPlaybook
    {
        $contactId = $uriVariables['contactId'] ?? null;
        if (!\is_int($contactId) && !\is_string($contactId)) {
            throw new NotFoundHttpException('Contact not found.');
        }

        $contact = $this->contactRepository->find((int) $contactId);
        if (!$contact instanceof Contact) {
            throw new NotFoundHttpException('Contact not found.');
        }

        $playbook = $this->playbookRepository->findActiveOrPausedForContact($contact);
        if (null === $playbook) {
            throw new NotFoundHttpException('No active playbook found for this contact.');
        }

        return $playbook;
    }
}
