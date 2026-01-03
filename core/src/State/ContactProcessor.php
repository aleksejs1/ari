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
                    },
                    // Matcher: Return true if same Group Resource
                    function ($incoming, $existing) {
                        $incomingGroup = $incoming->getGroupResource();
                        $existingGroup = $existing->getGroupResource();

                        return null !== $incomingGroup &&
                               null !== $existingGroup &&
                               $incomingGroup->getId() === $existingGroup->getId();
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
     * @param (callable(T, T): bool)|null $matcher Logic to match incoming item with existing item.
     *                                             If provided, smart update is performed.
     */
    private function handleCollection(
        Contact $owner,
        iterable $items,
        ?\Doctrine\Common\Collections\Collection $targetCollection,
        string $addMethod,
        bool $isPut,
        ?callable $extraLogic = null,
        ?callable $matcher = null
    ): void {
        if ($isPut && null !== $targetCollection && null !== $matcher) {
             // Smart Update Logic
             $itemsArr = is_array($items) ? $items : iterator_to_array($items);

             // 1. Identify items to remove (in target but not in items)
             // We iterate target backwards to safely remove
            foreach ($targetCollection->toArray() as $existingItem) {
                $found = false;
                foreach ($itemsArr as $incomingItem) {
                    if ($matcher($incomingItem, $existingItem)) {
                        $found = true;
                        break;
                    }
                }
                if (!$found) {
                    $targetCollection->removeElement($existingItem);
                }
            }

             // 2. Identify items to add or update
            foreach ($itemsArr as $incomingItem) {
                $match = null;
                foreach ($targetCollection as $existingItem) {
                    if ($matcher($incomingItem, $existingItem)) {
                        $match = $existingItem;
                        break;
                    }
                }

                if (null !== $match) {
                    // Case 1: ID was provided, so Incoming IS the Existing item (Identity Map)
                    if ($match === $incomingItem) {
                        // Serializer might have pointed it to the detached $data object.
                        // We must ensure it points to the managed $owner.
                        if (method_exists($match, 'setContact')) {
                            $match->setContact($owner);
                        }
                    } else {
                        // Case 2: ID missing (or different instance). Incoming is new/garbage.
                        // Check for pollution: Refreshing the Group entity to discard in-memory additions
                        if (method_exists($incomingItem, 'getGroupResource')) {
                            $groupRes = $incomingItem->getGroupResource();
                            if ($groupRes && $this->entityManager->contains($groupRes)) {
                                 $this->entityManager->refresh($groupRes);
                            }
                        }
                        // Detach the garbage item
                        $this->entityManager->detach($incomingItem);
                    }

                    // Run extra logic on the MATCH
                    if (null !== $extraLogic) {
                        $extraLogic($match, $owner);
                    }
                } else {
                    // Add new
                    if (method_exists($incomingItem, 'setContact')) {
                        $incomingItem->setContact($owner);
                    }
                    if ($incomingItem instanceof \App\Security\TenantAwareInterface) {
                        $incomingItem->setTenant($owner->getTenant());
                    }
                    if (null !== $extraLogic) {
                        $extraLogic($incomingItem, $owner);
                    }

                    /** @phpstan-ignore method.dynamicName */
                    $owner->$addMethod($incomingItem);
                }
            }
        } elseif ($isPut && null !== $targetCollection) {
            // Conventional "Clear and Replace"
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
