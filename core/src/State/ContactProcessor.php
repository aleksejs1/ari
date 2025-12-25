<?php

namespace App\State;

use ApiPlatform\Metadata\DeleteOperationInterface;
use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Entity\Contact;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\DependencyInjection\Attribute\Autowire;

/**
 * Processor for Contact entities that handles nested ContactName and ContactDate creation/updates.
 *
 * @implements ProcessorInterface<Contact, Contact|void>
 */
class ContactProcessor implements ProcessorInterface
{
    /**
     * @param ProcessorInterface<Contact, Contact|void> $userOwnerProcessor
     */
    public function __construct(
        #[Autowire(service: UserOwnerProcessor::class)]
        private ProcessorInterface $userOwnerProcessor,
        private EntityManagerInterface $entityManager,
    ) {
    }

    /**
     * @param Contact $data
     * @return Contact|void
     */
    #[\Override]
    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): mixed
    {
        $isPut = $operation instanceof \ApiPlatform\Metadata\Put;

        // For PUT operations on existing entities, we need to handle replacement semantics
        if ($isPut && isset($uriVariables['id'])) {
            // Get the existing entity from database
            $existing = $this->entityManager->find(Contact::class, $uriVariables['id']);

            if (null !== $existing) {
                // Clear existing collections (orphanRemoval will delete them)
                $existing->getContactNames()->clear();
                $existing->getContactDates()->clear();

                // Add new nested entities from the deserialized data
                foreach ($data->getContactNames() as $contactName) {
                    $contactName->setContact($existing);
                    $existing->addContactName($contactName);
                }

                foreach ($data->getContactDates() as $contactDate) {
                    $contactDate->setContact($existing);
                    $existing->addContactDate($contactDate);
                }

                // Flush changes and return the existing entity
                $this->entityManager->flush();
                return $existing;
            }
        } else {
            // For POST/PATCH operations, just link nested entities
            foreach ($data->getContactNames() as $contactName) {
                if (null === $contactName->getContact()) {
                    $contactName->setContact($data);
                }
            }

            foreach ($data->getContactDates() as $contactDate) {
                if (null === $contactDate->getContact()) {
                    $contactDate->setContact($data);
                }
            }
        }

        // Let the UserOwnerProcessor handle user assignment and main persistence
        return $this->userOwnerProcessor->process($data, $operation, $uriVariables, $context);
    }
}
