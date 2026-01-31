<?php

namespace Ari\EventSubscriber;

use Ari\Entity\Contact;
use Ari\Entity\ContactAddress;
use Ari\Entity\ContactBiography;
use Ari\Entity\ContactDate;
use Ari\Entity\ContactEmailAdress;
use Ari\Entity\ContactName;
use Ari\Entity\ContactOrganization;
use Ari\Entity\ContactPhoneNumber;
use Ari\Service\Google\GoogleContactUpdateService;
use Doctrine\Bundle\DoctrineBundle\Attribute\AsDoctrineListener;
use Doctrine\ORM\Event\OnFlushEventArgs;
use Doctrine\ORM\Event\PostFlushEventArgs;
use Doctrine\ORM\Events;

#[AsDoctrineListener(event: Events::onFlush)]
#[AsDoctrineListener(event: Events::postFlush)]
class ContactSyncSubscriber
{
    /** @var array<int, Contact> */
    private array $contactsToSync = [];

    public function __construct(
        private readonly GoogleContactUpdateService $googleContactUpdateService,
    ) {
    }

    public function onFlush(OnFlushEventArgs $args): void
    {
        $em = $args->getObjectManager();
        $uow = $em->getUnitOfWork();

        foreach ($uow->getScheduledEntityInsertions() as $entity) {
            if ($entity instanceof ContactPhoneNumber || $entity instanceof ContactName || $entity instanceof ContactEmailAdress || $entity instanceof ContactAddress || $entity instanceof ContactBiography || $entity instanceof ContactOrganization || $entity instanceof ContactDate) {
                $this->addContactToSync($entity->getContact());
            }
        }

        foreach ($uow->getScheduledEntityUpdates() as $entity) {
            if ($entity instanceof ContactPhoneNumber || $entity instanceof ContactName || $entity instanceof ContactEmailAdress || $entity instanceof ContactAddress || $entity instanceof ContactBiography || $entity instanceof ContactOrganization || $entity instanceof ContactDate) {
                $this->addContactToSync($entity->getContact());
            }
        }

        foreach ($uow->getScheduledEntityDeletions() as $entity) {
            if ($entity instanceof ContactPhoneNumber || $entity instanceof ContactName || $entity instanceof ContactEmailAdress || $entity instanceof ContactAddress || $entity instanceof ContactBiography || $entity instanceof ContactOrganization || $entity instanceof ContactDate) {
                $this->addContactToSync($entity->getContact());
            }
        }
    }

    public function postFlush(PostFlushEventArgs $args): void
    {
        if ([] === $this->contactsToSync) {
            return;
        }

        $contacts = $this->contactsToSync;
        $this->contactsToSync = [];

        foreach ($contacts as $contact) {
            try {
                $this->googleContactUpdateService->updateContact($contact);
            } catch (\Exception) {
                // Fail silently or log?
                // For now, let's not block the flush if Google sync fails.
            }
        }
    }

    private function addContactToSync(?Contact $contact): void
    {
        $contactId = $contact?->getId();
        if (null !== $contact && null !== $contactId) {
            $this->contactsToSync[$contactId] = $contact;
        }
    }
}
