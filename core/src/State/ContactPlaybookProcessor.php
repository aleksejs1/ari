<?php

declare(strict_types=1);

namespace Ari\State;

use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Operation;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use ApiPlatform\State\ProcessorInterface;
use Ari\Entity\Contact;
use Ari\Entity\ContactPlaybook;
use Ari\Entity\User;
use Ari\Repository\ContactPlaybookRepository;
use Ari\Repository\ContactRepository;
use Ari\Service\ContactPlaybookService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;

/**
 * Handles POST, PATCH, DELETE on /api/contacts/{contactId}/playbook.
 *
 * POST  — activates a new playbook (or switches from existing one).
 * PATCH — transitions status (active↔paused) or updates whyTags/whyText/celebrationPending.
 * DELETE — archives the active playbook.
 *
 * @implements ProcessorInterface<ContactPlaybook, ContactPlaybook|null>
 */
final readonly class ContactPlaybookProcessor implements ProcessorInterface
{
    public function __construct(
        private ContactPlaybookService $playbookService,
        private ContactPlaybookRepository $playbookRepository,
        private ContactRepository $contactRepository,
        private EntityManagerInterface $em,
        private Security $security,
    ) {
    }

    #[\Override]
    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): ContactPlaybook|null
    {
        $user = $this->security->getUser();
        if (!$user instanceof User) {
            throw new AccessDeniedHttpException();
        }

        $contactId = $uriVariables['contactId'] ?? null;
        if (!\is_int($contactId) && !\is_string($contactId)) {
            throw new NotFoundHttpException('Contact not found.');
        }

        $contact = $this->contactRepository->find((int) $contactId);
        if (!$contact instanceof Contact) {
            throw new NotFoundHttpException('Contact not found.');
        }

        // Ensure the contact belongs to the requesting user (tenant check)
        if ($contact->getTenant() !== $user) {
            throw new AccessDeniedHttpException();
        }

        // Enforce API key scope: CONTACT_EDIT is required (not just CONTACT_VIEW)
        if (!$this->security->isGranted('CONTACT_EDIT', $contact)) {
            throw new AccessDeniedHttpException();
        }

        return match (true) {
            $operation instanceof Post => $this->handlePost($data, $contact, $user),
            $operation instanceof Patch => $this->handlePatch($data, $contact),
            $operation instanceof Delete => $this->handleDelete($contact),
            default => throw new \LogicException('Unsupported operation.'),
        };
    }

    private function handlePost(mixed $data, Contact $contact, User $user): ContactPlaybook
    {
        if (!$data instanceof ContactPlaybook) {
            throw new \InvalidArgumentException(sprintf('Expected %s, got %s.', ContactPlaybook::class, get_debug_type($data)));
        }

        $preset = $data->getPreset();
        if ('' === $preset) {
            throw new UnprocessableEntityHttpException('preset is required.');
        }

        return $this->playbookService->activate(
            $contact,
            $preset,
            $data->getWhyTags(),
            $data->getWhyText(),
            $user,
        );
    }

    private function handlePatch(mixed $data, Contact $contact): ContactPlaybook
    {
        if (!$data instanceof ContactPlaybook) {
            throw new \InvalidArgumentException(sprintf('Expected %s, got %s.', ContactPlaybook::class, get_debug_type($data)));
        }

        $playbook = $this->playbookRepository->findActiveOrPausedForContact($contact);

        if (null === $playbook) {
            throw new NotFoundHttpException('No active or paused playbook found for this contact.');
        }

        $uow = $this->em->getUnitOfWork();
        $originalData = $uow->getOriginalEntityData($data);

        // Handle status transition
        $previousStatus = $originalData['status'] ?? $playbook->getStatus();
        $requestedStatus = $data->getStatus();

        if ($previousStatus !== $requestedStatus) {
            match ([$previousStatus, $requestedStatus]) {
                [ContactPlaybook::STATUS_ACTIVE, ContactPlaybook::STATUS_PAUSED] => $this->playbookService->pause($playbook),
                [ContactPlaybook::STATUS_PAUSED, ContactPlaybook::STATUS_ACTIVE] => $this->playbookService->resume($playbook),
                default => throw new UnprocessableEntityHttpException(
                    sprintf('Invalid status transition from %s to %s.', $previousStatus, $requestedStatus),
                ),
            };
        }

        // Update why fields if provided
        $this->playbookService->updateWhy($playbook, $data->getWhyTags(), $data->getWhyText());

        // Handle celebrationPending: clients may only acknowledge (set to false), not enable it.
        $requestedCelebration = $data->isCelebrationPending();
        if (true === $requestedCelebration && !$playbook->isCelebrationPending()) {
            throw new UnprocessableEntityHttpException('celebrationPending cannot be set to true by clients.');
        }
        if (false === $requestedCelebration) {
            $playbook->setCelebrationPending(false);
        }

        $this->em->flush();

        return $playbook;
    }

    private function handleDelete(Contact $contact): null
    {
        $playbook = $this->playbookRepository->findActiveOrPausedForContact($contact);
        if (null === $playbook) {
            throw new NotFoundHttpException('No active or paused playbook found for this contact.');
        }

        $this->playbookService->archive($playbook, 'user_delete');
        $this->em->flush();

        return null;
    }
}
