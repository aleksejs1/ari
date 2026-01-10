<?php

namespace App\EventSubscriber;

use App\Entity\Contact;
use App\Entity\ContactAddress;
use App\Entity\ContactBiography;
use App\Entity\ContactDate;
use App\Entity\ContactEmailAdress;
use App\Entity\ContactName;
use App\Entity\ContactOrganization;
use App\Entity\ContactPhoneNumber;
use App\Service\Google\GoogleContactUpdateService;
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
