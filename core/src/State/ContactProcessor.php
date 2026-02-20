<?php

namespace Ari\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use Ari\Entity\Contact;
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
            if ($user instanceof \Ari\Entity\User) {
                $data->setTenant($user);
                $data->setUser($user);
            }
        }

        $isPut = $operation instanceof \ApiPlatform\Metadata\Put;

        // For PUT operations on existing entities, we need to handle replacement semantics
        if ($isPut && isset($uriVariables['id'])) {
            $existing = $this->entityManager->find(Contact::class, $uriVariables['id']);

            if (null !== $existing) {
                $this->handleClearAndReplace(
                    $existing,
                    $data->getContactNames(),
                    $existing->getContactNames(),
                    'addContactName',
                    null,
                );
                $this->handleClearAndReplace(
                    $existing,
                    $data->getContactDates(),
                    $existing->getContactDates(),
                    'addContactDate',
                    null,
                );
                $this->handleClearAndReplace(
                    $existing,
                    $data->getPhoneNumbers(),
                    $existing->getPhoneNumbers(),
                    'addPhoneNumber',
                    null,
                );
                $this->handleClearAndReplace(
                    $existing,
                    $data->getContactEmailAdresses(),
                    $existing->getContactEmailAdresses(),
                    'addContactEmailAdress',
                    null,
                );
                $this->handleClearAndReplace(
                    $existing,
                    $data->getContactAddresses(),
                    $existing->getContactAddresses(),
                    'addContactAddress',
                    null,
                );

                // ContactGroup has extra logic
                $this->handleSmartUpdate(
                    $existing,
                    $data->getContactGroups(),
                    $existing->getContactGroups(),
                    'addContactGroup',
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

                        return null !== $incomingGroup
                               && null !== $existingGroup
                               && $incomingGroup->getId() === $existingGroup->getId();
                    },
                );

                $this->handleClearAndReplace(
                    $existing,
                    $data->getContactOrganizations(),
                    $existing->getContactOrganizations(),
                    'addContactOrganization',
                    null,
                );
                $this->handleClearAndReplace(
                    $existing,
                    $data->getContactBiographies(),
                    $existing->getContactBiographies(),
                    'addContactBiography',
                    null,
                );
                // Filter out reverse relations from incoming data.
                // Reverse relations are read-only (owned by other contacts);
                // only forward relations should be synced during PUT.
                /** @var array<int, true> $reverseIds */
                $reverseIds = [];
                foreach ($existing->getReverseContactRelationsCollection() as $rev) {
                    $revId = $rev->getId();
                    if (null !== $revId) {
                        $reverseIds[$revId] = true;
                    }
                }
                $forwardRelations = [];
                foreach ($data->getContactRelations() as $rel) {
                    $relId = $rel->getId();
                    if (null !== $relId && isset($reverseIds[$relId])) {
                        // Reverse relation: undo any denormalizer modifications
                        if ($this->entityManager->contains($rel)) {
                            $this->entityManager->refresh($rel);
                        }
                        continue; // Skip reverse relations — managed by their owner contact
                    }
                    $forwardRelations[] = $rel;
                }
                $this->handleClearAndReplace(
                    $existing,
                    $forwardRelations,
                    $existing->getContactRelationsCollection(),
                    'addContactRelation',
                    null,
                );
                $this->handleClearAndReplace(
                    $existing,
                    $data->getContactInteractions(),
                    $existing->getContactInteractions(),
                    'addContactInteraction',
                    null,
                );

                // Flush changes and return the existing entity
                $this->entityManager->flush();

                return $existing;
            }
        } else {
            // For POST/PATCH operations, just link nested entities
            $this->handleSimpleAdd($data, $data->getContactNames(), null);
            $this->handleSimpleAdd($data, $data->getContactDates(), null);
            $this->handleSimpleAdd($data, $data->getPhoneNumbers(), null);
            $this->handleSimpleAdd($data, $data->getContactEmailAdresses(), null);
            $this->handleSimpleAdd($data, $data->getContactAddresses(), null);

            $this->handleSimpleAdd(
                $data,
                $data->getContactGroups(),
                function ($contactGroup, $owner) {
                    // Propagate tenant to nested Group if it's new
                    $group = $contactGroup->getGroupResource();
                    if (null !== $group && null === $group->getUser()) {
                        $group->setUser($owner->getTenant());
                    }
                },
            );

            $this->handleSimpleAdd($data, $data->getContactOrganizations(), null);
            $this->handleSimpleAdd($data, $data->getContactBiographies(), null);
            $this->handleSimpleAdd($data, $data->getContactRelations(), null);
            $this->handleSimpleAdd($data, $data->getContactInteractions(), null);
        }

        // Let the UserOwnerProcessor handle user assignment and main persistence
        return $this->userOwnerProcessor->process($data, $operation, $uriVariables, $context);
    }

    /**
     * @template T of object
     *
     * @param iterable<mixed, T>                              $items
     * @param \Doctrine\Common\Collections\Collection<int, T> $targetCollection
     * @param (callable(T, Contact): void)|null               $extraLogic
     * @param (callable(T, T): bool)                          $matcher
     */
    private function handleSmartUpdate(
        Contact $owner,
        iterable $items,
        \Doctrine\Common\Collections\Collection $targetCollection,
        string $addMethod,
        ?callable $extraLogic,
        callable $matcher,
    ): void {
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
                if ($incomingItem instanceof \Ari\Security\TenantAwareInterface) {
                    $incomingItem->setTenant($owner->getTenant());
                }
                if (null !== $extraLogic) {
                    $extraLogic($incomingItem, $owner);
                }

                /* @phpstan-ignore method.dynamicName */
                $owner->$addMethod($incomingItem);
            }
        }
    }

    /**
     * @template T of object
     *
     * @param iterable<mixed, T>                              $items
     * @param \Doctrine\Common\Collections\Collection<int, T> $targetCollection
     * @param (callable(T, Contact): void)|null               $extraLogic
     */
    private function handleClearAndReplace(
        Contact $owner,
        iterable $items,
        \Doctrine\Common\Collections\Collection $targetCollection,
        string $addMethod,
        ?callable $extraLogic,
    ): void {
        $itemsArr = is_array($items) ? $items : iterator_to_array($items);

        // Special Case: Single Item Update (Incoming has no ID -> Update singleton existing)
        if (1 === $targetCollection->count() && 1 === count($itemsArr)) {
            $existingItem = $targetCollection->first();
            $incomingItem = reset($itemsArr);

            if (is_object($existingItem)) {
                $incomingId = method_exists($incomingItem, 'getId') ? $incomingItem->getId() : null;

                if (null === $incomingId) {
                    // Update existing item with incoming data
                    $this->updateEntityData($existingItem, $incomingItem);
                    $this->prepareItem($owner, $existingItem, $extraLogic);

                    return;
                }
            }
        }

        $incomingById = [];

        foreach ($itemsArr as $item) {
            if (method_exists($item, 'getId') && null !== $item->getId()) {
                $incomingById[$item->getId()] = $item;
            }
        }

        // 1. Remove items not present in incoming list
        foreach ($targetCollection->toArray() as $existingItem) {
            $existingId = method_exists($existingItem, 'getId') ? $existingItem->getId() : null;
            if (null !== $existingId && !array_key_exists($existingId, $incomingById)) {
                $targetCollection->removeElement($existingItem);
            }
        }

        // 2. Update existing items or Add new items
        foreach ($itemsArr as $incomingItem) {
            $incomingId = method_exists($incomingItem, 'getId') ? $incomingItem->getId() : null;

            if (null !== $incomingId) {
                // Check if this ID exists in the target collection
                $existingItem = null;
                foreach ($targetCollection as $targetItem) {
                    if (method_exists($targetItem, 'getId') && $targetItem->getId() === $incomingId) {
                        $existingItem = $targetItem;
                        break;
                    }
                }

                if (null !== $existingItem) {
                    // Update: If instances differ, copy data to existing instance
                    if ($existingItem !== $incomingItem) {
                        $this->updateEntityData($existingItem, $incomingItem);
                    }
                    $this->prepareItem($owner, $existingItem, $extraLogic);
                } else {
                    // Not found in target (rare for ClearAndReplace with ID), treat as add
                    $this->prepareItem($owner, $incomingItem, $extraLogic);
                    /* @phpstan-ignore method.dynamicName */
                    $owner->$addMethod($incomingItem);
                }
            } else {
                // No ID -> New item
                $this->prepareItem($owner, $incomingItem, $extraLogic);
                /* @phpstan-ignore method.dynamicName */
                $owner->$addMethod($incomingItem);
            }
        }
    }

    private function updateEntityData(object $target, object $source): void
    {
        $reflection = new \ReflectionClass($target);
        $sourceReflection = new \ReflectionClass($source);

        foreach ($reflection->getProperties() as $property) {
            if ('id' === $property->getName()) {
                continue;
            }
            if (!$sourceReflection->hasProperty($property->getName())) {
                continue;
            }

            $sourceProp = $sourceReflection->getProperty($property->getName());
            // $sourceProp->setAccessible(true);
            // $property->setAccessible(true);

            if ($sourceProp->isInitialized($source)) {
                $value = $sourceProp->getValue($source);
                $property->setValue($target, $value);
            }
        }
    }

    /**
     * @template T of object
     *
     * @param T                                 $item
     * @param (callable(T, Contact): void)|null $extraLogic
     */
    private function prepareItem(Contact $owner, object $item, ?callable $extraLogic): void
    {
        if (method_exists($item, 'setContact')) {
            $item->setContact($owner);
        }
        if ($item instanceof \Ari\Security\TenantAwareInterface) {
            $item->setTenant($owner->getTenant());
        }

        if (null !== $extraLogic) {
            $extraLogic($item, $owner);
        }
    }

    /**
     * @template T of object
     *
     * @param iterable<mixed, T>                $items
     * @param (callable(T, Contact): void)|null $extraLogic
     */
    private function handleSimpleAdd(
        Contact $owner,
        iterable $items,
        ?callable $extraLogic,
    ): void {
        foreach ($items as $item) {
            if (method_exists($item, 'getContact') && method_exists($item, 'setContact')) {
                if (null === $item->getContact()) {
                    $item->setContact($owner);
                }
            }
            if ($item instanceof \Ari\Security\TenantAwareInterface) {
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
