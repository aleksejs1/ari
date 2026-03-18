<?php

declare(strict_types=1);

namespace Ari\Service;

use Ari\Entity\Contact;
use Ari\Entity\ContactPlaybook;
use Ari\Entity\ContactTask;
use Ari\Entity\User;
use Ari\Repository\ContactPlaybookRepository;
use Ari\Repository\ContactTaskRepository;
use Doctrine\ORM\EntityManagerInterface;
use Psr\Log\LoggerInterface;

final class ContactPlaybookService
{
    public function __construct(
        private readonly ContactPlaybookRepository $playbookRepository,
        private readonly ContactTaskRepository $taskRepository,
        private readonly PlaybookTemplateRegistry $registry,
        private readonly ContactTaskGeneratorService $generator,
        private readonly EntityManagerInterface $em,
        private readonly LoggerInterface $logger,
    ) {
    }

    /**
     * Activates a playbook for a contact.
     * Archives any existing active playbook first.
     * Wrapped in a transaction to prevent partial state.
     *
     * @param list<string>|null $whyTags
     */
    public function activate(Contact $contact, string $preset, ?array $whyTags, ?string $whyText, User $user): ContactPlaybook
    {
        // Validate preset first (throws if unknown)
        $config = $this->registry->findByPreset($preset);

        return $this->em->wrapInTransaction(function () use ($contact, $preset, $config, $whyTags, $whyText, $user): ContactPlaybook {
            // Archive existing active playbook
            $existing = $this->playbookRepository->findActiveForContact($contact);
            if (null !== $existing) {
                $this->archive($existing, 'switch');
            }

            // Create new playbook
            $playbook = new ContactPlaybook();
            $playbook->setContact($contact);
            $playbook->setPreset($preset);
            $playbook->setGoal($config->goal);
            $playbook->setWhyTags($whyTags);
            $playbook->setWhyText($whyText);
            $playbook->setStatus(ContactPlaybook::STATUS_ACTIVE);
            $playbook->setTenant($user);

            $this->em->persist($playbook);
            $this->em->flush(); // need ID for task FK

            // Generate initial tasks
            $this->generator->generateInitialTasks($playbook);
            $this->em->flush();

            $this->logger->info('playbook_activated', [
                'tenant_id' => $user->getId(),
                'contact_id' => $contact->getId(),
                'preset' => $preset,
                'goal' => $config->goal,
            ]);

            return $playbook;
        });
    }

    public function archive(ContactPlaybook $playbook, string $reason = 'user_delete'): void
    {
        $playbook->setStatus(ContactPlaybook::STATUS_ARCHIVED);

        // Archive all pending tasks
        $this->archiveTasksForPlaybook($playbook, [ContactTask::STATUS_PENDING]);

        $this->logger->info('playbook_archived', [
            'tenant_id' => $playbook->getTenant()?->getId(),
            'contact_id' => $playbook->getContact()?->getId(),
            'preset' => $playbook->getPreset(),
            'reason' => $reason,
        ]);
    }

    public function pause(ContactPlaybook $playbook): void
    {
        $playbook->setStatus(ContactPlaybook::STATUS_PAUSED);
        $this->archiveTasksForPlaybook($playbook, [ContactTask::STATUS_PENDING], ContactTask::STATUS_PAUSED);

        $this->logger->info('playbook_paused', [
            'tenant_id' => $playbook->getTenant()?->getId(),
            'contact_id' => $playbook->getContact()?->getId(),
            'preset' => $playbook->getPreset(),
        ]);
    }

    public function resume(ContactPlaybook $playbook): void
    {
        $playbook->setStatus(ContactPlaybook::STATUS_ACTIVE);
        $today = new \DateTimeImmutable('today');

        // Find all paused tasks and reset them to pending with today's due date
        $tasks = $this->taskRepository->findBy(['playbook' => $playbook, 'status' => ContactTask::STATUS_PAUSED]);
        foreach ($tasks as $task) {
            $task->setStatus(ContactTask::STATUS_PENDING);
            $task->setDueDate($today);
        }

        $this->logger->info('playbook_resumed', [
            'tenant_id' => $playbook->getTenant()?->getId(),
            'contact_id' => $playbook->getContact()?->getId(),
            'preset' => $playbook->getPreset(),
        ]);
    }

    /**
     * Gap-fills missing tasks for all active playbooks.
     * Called by OverdueTaskGeneratorCommand to avoid a Command→Repository dependency.
     *
     * @return int number of playbooks checked
     */
    public function generateMissingTasksForAllActive(): int
    {
        $playbooks = $this->playbookRepository->findBy(['status' => ContactPlaybook::STATUS_ACTIVE]);
        foreach ($playbooks as $playbook) {
            $this->generator->generateMissingTasks($playbook);
        }
        $this->em->flush();

        return \count($playbooks);
    }

    /**
     * @param list<string>|null $whyTags
     */
    public function updateWhy(ContactPlaybook $playbook, ?array $whyTags, ?string $whyText): void
    {
        $playbook->setWhyTags($whyTags);
        $playbook->setWhyText($whyText);
    }

    /**
     * @param list<string> $fromStatuses
     */
    private function archiveTasksForPlaybook(ContactPlaybook $playbook, array $fromStatuses, string $toStatus = ContactTask::STATUS_ARCHIVED): void
    {
        $tasks = $this->taskRepository->findBy(['playbook' => $playbook, 'status' => $fromStatuses]);
        foreach ($tasks as $task) {
            $task->setStatus($toStatus);
        }
    }
}
