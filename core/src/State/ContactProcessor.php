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
                $this->handleCollection(
                    $existing,
                    $data->getContactNames(),
                    $existing->getContactNames(),
                    'addContactName',
                    true
                );
                $this->handleCollection(
                    $existing,
                    $data->getContactDates(),
                    $existing->getContactDates(),
                    'addContactDate',
                    true
                );
                $this->handleCollection(
                    $existing,
                    $data->getPhoneNumbers(),
                    $existing->getPhoneNumbers(),
                    'addPhoneNumber',
                    true
                );
                $this->handleCollection(
                    $existing,
                    $data->getContactEmailAdresses(),
                    $existing->getContactEmailAdresses(),
                    'addContactEmailAdress',
                    true
                );
                $this->handleCollection(
                    $existing,
                    $data->getContactAddresses(),
                    $existing->getContactAddresses(),
                    'addContactAddress',
                    true
                );

                // ContactGroup has extra logic
                $this->handleCollection(
                    $existing,
                    $data->getContactGroups(),
                    $existing->getContactGroups(),
                    'addContactGroup',
                    true,
                    function ($contactGroup, $owner) {
                         // Propagate tenant to nested Group if it's new
                        $group = $contactGroup->getGroupResource();
                        if (null !== $group && null === $group->getUser()) {
                            $group->setUser($owner->getTenant());
                        }
                    }
                );

                $this->handleCollection(
                    $existing,
                    $data->getContactOrganizations(),
                    $existing->getContactOrganizations(),
                    'addContactOrganization',
                    true
                );
                $this->handleCollection(
                    $existing,
                    $data->getContactBiographies(),
                    $existing->getContactBiographies(),
                    'addContactBiography',
                    true
                );
                $existing->getReverseContactRelationsCollection()->clear();
                $this->handleCollection(
                    $existing,
                    $data->getContactRelations(),
                    $existing->getContactRelationsCollection(),
                    'addContactRelation',
                    true
                );

                // Flush changes and return the existing entity
                $this->entityManager->flush();

                return $existing;
            }
        } else {
            // For POST/PATCH operations, just link nested entities
            $this->handleCollection($data, $data->getContactNames(), null, 'addContactName', false);
            $this->handleCollection($data, $data->getContactDates(), null, 'addContactDate', false);
            $this->handleCollection($data, $data->getPhoneNumbers(), null, 'addPhoneNumber', false);
            $this->handleCollection($data, $data->getContactEmailAdresses(), null, 'addContactEmailAdress', false);
            $this->handleCollection($data, $data->getContactAddresses(), null, 'addContactAddress', false);

            $this->handleCollection(
                $data,
                $data->getContactGroups(),
                null,
                'addContactGroup',
                false,
                function ($contactGroup, $owner) {
                     // Propagate tenant to nested Group if it's new
                    $group = $contactGroup->getGroupResource();
                    if (null !== $group && null === $group->getUser()) {
                        $group->setUser($owner->getTenant());
                    }
                }
            );

            $this->handleCollection($data, $data->getContactOrganizations(), null, 'addContactOrganization', false);
            $this->handleCollection($data, $data->getContactBiographies(), null, 'addContactBiography', false);
            $this->handleCollection($data, $data->getContactRelations(), null, 'addContactRelation', false);
        }

        // Let the UserOwnerProcessor handle user assignment and main persistence
        return $this->userOwnerProcessor->process($data, $operation, $uriVariables, $context);
    }

    /**
     * @template T of object
     * @param Contact $owner
     * @param iterable<mixed, T> $items
     * @param \Doctrine\Common\Collections\Collection<int, T>|null $targetCollection
     * @param string $addMethod
     * @param bool $isPut
     * @param (callable(T, Contact): void)|null $extraLogic
     */
    private function handleCollection(
        Contact $owner,
        iterable $items,
        ?\Doctrine\Common\Collections\Collection $targetCollection,
        string $addMethod,
        bool $isPut,
        ?callable $extraLogic = null
    ): void {
        if ($isPut && null !== $targetCollection) {
            $targetCollection->clear();
            foreach ($items as $item) {
                if (method_exists($item, 'setContact')) {
                    $item->setContact($owner);
                }
                if ($item instanceof \App\Security\TenantAwareInterface) {
                    $item->setTenant($owner->getTenant());
                }

                if (null !== $extraLogic) {
                    $extraLogic($item, $owner);
                }

                /** @phpstan-ignore method.dynamicName */
                $owner->$addMethod($item);
            }
        } else {
            foreach ($items as $item) {
                if (method_exists($item, 'getContact') && method_exists($item, 'setContact')) {
                    if (null === $item->getContact()) {
                        $item->setContact($owner);
                    }
                }
                if ($item instanceof \App\Security\TenantAwareInterface) {
                    if (null === $item->getTenant()) {
                        $item->setTenant($owner->getTenant());
                    }
                }

                if (null !== $extraLogic) {
                    $extraLogic($item, $owner);
                }
            }
        }
    }
}
