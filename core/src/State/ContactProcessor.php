<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Entity\Contact;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\SecurityBundle\Security;
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
        private Security $security,
    ) {
    }

    /**
     * @param Contact $data
     *
     * @return Contact|void
     */
    #[\Override]
    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): mixed
    {
        if (null === $data->getTenant()) {
            $user = $this->security->getUser();
            if ($user instanceof \App\Entity\User) {
                $data->setTenant($user);
                $data->setUser($user);
            }
        }

        $isPut = $operation instanceof \ApiPlatform\Metadata\Put;

        // For PUT operations on existing entities, we need to handle replacement semantics
        if ($isPut && isset($uriVariables['id'])) {
            // Get the existing entity from database
            $existing = $this->entityManager->find(Contact::class, $uriVariables['id']);

            if (null !== $existing) {
                // Clear existing collections (orphanRemoval will delete them)
                $existing->getContactNames()->clear();
                $existing->getContactDates()->clear();
                $existing->getPhoneNumbers()->clear();
                $existing->getPhoneNumbers()->clear();
                $existing->getContactEmailAdresses()->clear();
                $existing->getContactAddresses()->clear();
                $existing->getContactGroups()->clear();
                $existing->getContactOrganizations()->clear();

                // Add new nested entities from the deserialized data
                foreach ($data->getContactNames() as $contactName) {
                    $contactName->setContact($existing);
                    $contactName->setTenant($existing->getTenant());
                    $existing->addContactName($contactName);
                }

                foreach ($data->getContactDates() as $contactDate) {
                    $contactDate->setContact($existing);
                    $contactDate->setTenant($existing->getTenant());
                    $existing->addContactDate($contactDate);
                }

                foreach ($data->getPhoneNumbers() as $phoneNumber) {
                    $phoneNumber->setContact($existing);
                    $phoneNumber->setTenant($existing->getTenant());
                    $existing->addPhoneNumber($phoneNumber);
                }

                foreach ($data->getContactEmailAdresses() as $email) {
                    $email->setContact($existing);
                    $email->setTenant($existing->getTenant());
                    $existing->addContactEmailAdress($email);
                }

                foreach ($data->getContactAddresses() as $address) {
                    $address->setContact($existing);
                    $address->setTenant($existing->getTenant());
                    $existing->addContactAddress($address);
                }

                foreach ($data->getContactGroups() as $contactGroup) {
                    $contactGroup->setContact($existing);
                    $contactGroup->setTenant($existing->getTenant());

                    // Propagate tenant to nested Group if it's new
                    $group = $contactGroup->getGroupResource();
                    if (null !== $group && null === $group->getUser()) {
                        $group->setUser($existing->getTenant());
                    }

                    $existing->addContactGroup($contactGroup);
                }

                foreach ($data->getContactOrganizations() as $contactOrganization) {
                    $contactOrganization->setContact($existing);
                    $contactOrganization->setTenant($existing->getTenant());
                    $existing->addContactOrganization($contactOrganization);
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
                if (null === $contactName->getTenant()) {
                    $contactName->setTenant($data->getTenant());
                }
            }

            foreach ($data->getContactDates() as $contactDate) {
                if (null === $contactDate->getContact()) {
                    $contactDate->setContact($data);
                }
                if (null === $contactDate->getTenant()) {
                    $contactDate->setTenant($data->getTenant());
                }
            }

            foreach ($data->getPhoneNumbers() as $phoneNumber) {
                if (null === $phoneNumber->getContact()) {
                    $phoneNumber->setContact($data);
                }
                if (null === $phoneNumber->getTenant()) {
                    $phoneNumber->setTenant($data->getTenant());
                }
            }

            foreach ($data->getContactEmailAdresses() as $email) {
                if (null === $email->getContact()) {
                    $email->setContact($data);
                }
                if (null === $email->getTenant()) {
                    $email->setTenant($data->getTenant());
                }
            }

            foreach ($data->getContactAddresses() as $address) {
                if (null === $address->getContact()) {
                    $address->setContact($data);
                }
                if (null === $address->getTenant()) {
                    $address->setTenant($data->getTenant());
                }
            }

            foreach ($data->getContactGroups() as $contactGroup) {
                if (null === $contactGroup->getContact()) {
                    $contactGroup->setContact($data);
                }
                if (null === $contactGroup->getTenant()) {
                    $contactGroup->setTenant($data->getTenant());
                }

                // Propagate tenant to nested Group if it's new
                $group = $contactGroup->getGroupResource();
                if (null !== $group && null === $group->getUser()) {
                    $group->setUser($data->getTenant());
                }
            }

            foreach ($data->getContactOrganizations() as $contactOrganization) {
                if (null === $contactOrganization->getContact()) {
                    $contactOrganization->setContact($data);
                }
                if (null === $contactOrganization->getTenant()) {
                    $contactOrganization->setTenant($data->getTenant());
                }
            }
        }

        // Let the UserOwnerProcessor handle user assignment and main persistence
        return $this->userOwnerProcessor->process($data, $operation, $uriVariables, $context);
    }
}
