<?php

namespace Ari\Service\ContactImport;

use Ari\Dto\ContactImportDto;
use Ari\Entity\Contact;
use Ari\Entity\ContactAddress;
use Ari\Entity\ContactBiography;
use Ari\Entity\ContactDate;
use Ari\Entity\ContactEmailAdress;
use Ari\Entity\ContactGroup;
use Ari\Entity\ContactName;
use Ari\Entity\ContactOrganization;
use Ari\Entity\ContactPhoneNumber;
use Ari\Entity\Group;
use Ari\Entity\User;
use Ari\Service\AvatarManager;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\DependencyInjection\Attribute\AutowireIterator;

class ContactImportService
{
    use \Ari\Service\Helper\CollectionSyncTrait;

    /**
     * @param iterable<ContactDuplicateCheckerInterface> $checkers
     */
    public function __construct(
        #[AutowireIterator('app.contact_duplicate_checker')]
        private readonly iterable $checkers,
        private readonly EntityManagerInterface $entityManager,
        private readonly AvatarManager $avatarManager,
    ) {
    }

    public function import(ContactImportDto $dto, User $user, bool $merge = true): ?Contact
    {
        foreach ($this->checkers as $checker) {
            if ($checker->isDuplicate($dto, $user)) {
                return null;
            }
        }

        $contact = new Contact();
        $contact->setUser($user);

        return $this->update($contact, $dto, $merge);
    }

    public function update(Contact $contact, ContactImportDto $dto, bool $merge = true): Contact
    {
        $this->syncCollection(
            $contact->getContactNames(),
            $dto->names,
            function (ContactName $entity, $dto) {
                return $entity->getGiven() === $dto->given && $entity->getFamily() === $dto->family;
            },
            function (ContactName $entity, $dto) {
                $entity->setGiven($dto->given);
                $entity->setFamily($dto->family);
            },
            function ($dto) use ($contact) {
                $entity = new ContactName($contact);
                $entity->setGiven($dto->given);
                $entity->setFamily($dto->family);

                return $entity;
            },
            !$merge,
        );

        $this->syncCollection(
            $contact->getContactDates(),
            $dto->dates,
            function (ContactDate $entity, $dto) {
                $dateDto = $dto->date instanceof \DateTime ? $dto->date : \DateTime::createFromInterface($dto->date);
                $entityDate = $entity->getDate();

                return null !== $entityDate
                    && $entityDate->format('Y-m-d') === $dateDto->format('Y-m-d')
                    && $entity->getText() === $dto->text;
            },
            function (ContactDate $entity, $dto) {
                $entity->setDate(
                    $dto->date instanceof \DateTime ? $dto->date : \DateTime::createFromInterface($dto->date),
                );
                $entity->setText($dto->text);
            },
            function ($dto) use ($contact) {
                $entity = new ContactDate($contact);
                $entity->setDate(
                    $dto->date instanceof \DateTime ? $dto->date : \DateTime::createFromInterface($dto->date),
                );
                $entity->setText($dto->text);

                return $entity;
            },
            !$merge,
        );

        $this->syncCollection(
            $contact->getContactEmailAdresses(),
            $dto->emails,
            function (ContactEmailAdress $entity, $dto) {
                return $entity->getValue() === $dto->value && $entity->getType() === $dto->type;
            },
            function (ContactEmailAdress $entity, $dto) {
                $entity->setValue($dto->value);
                $entity->setType($dto->type);
            },
            function ($dto) use ($contact) {
                $entity = new ContactEmailAdress($contact);
                $entity->setValue($dto->value);
                $entity->setType($dto->type);

                return $entity;
            },
            !$merge,
        );

        $this->syncCollection(
            $contact->getPhoneNumbers(),
            $dto->phones,
            function (ContactPhoneNumber $entity, $dto) {
                return $entity->getValue() === $dto->value && $entity->getType() === $dto->type;
            },
            function (ContactPhoneNumber $entity, $dto) {
                $entity->setValue($dto->value);
                $entity->setType($dto->type);
            },
            function ($dto) use ($contact) {
                $entity = new ContactPhoneNumber($contact);
                $entity->setValue($dto->value);
                $entity->setType($dto->type);

                return $entity;
            },
            !$merge,
        );

        $this->syncCollection(
            $contact->getContactAddresses(),
            $dto->addresses,
            function (ContactAddress $entity, $dto) {
                return $entity->getStreet() === $dto->street
                    && $entity->getStreetExtended() === $dto->streetExtended
                    && $entity->getCity() === $dto->city
                    && $entity->getRegion() === $dto->region
                    && $entity->getPostalCode() === $dto->postalCode
                    && $entity->getCountry() === $dto->country
                    && $entity->getCountryCode() === $dto->countryCode
                    && $entity->getType() === $dto->type;
            },
            function (ContactAddress $entity, $dto) {
                $entity->setStreet($dto->street);
                $entity->setStreetExtended($dto->streetExtended);
                $entity->setCity($dto->city);
                $entity->setRegion($dto->region);
                $entity->setPostalCode($dto->postalCode);
                $entity->setCountry($dto->country);
                $entity->setCountryCode($dto->countryCode);
                $entity->setType($dto->type);
            },
            function ($dto) use ($contact) {
                $entity = new ContactAddress($contact);
                $entity->setStreet($dto->street);
                $entity->setStreetExtended($dto->streetExtended);
                $entity->setCity($dto->city);
                $entity->setRegion($dto->region);
                $entity->setPostalCode($dto->postalCode);
                $entity->setCountry($dto->country);
                $entity->setCountryCode($dto->countryCode);
                $entity->setType($dto->type);

                return $entity;
            },
            !$merge,
        );

        $this->syncCollection(
            $contact->getContactOrganizations(),
            $dto->organizations,
            function (ContactOrganization $entity, $dto) {
                $datesMatch = true;

                $entityStartDate = $entity->getStartDate();
                $dtoStartDate = $dto->startDate;
                if ((null === $entityStartDate) !== (null === $dtoStartDate)) {
                    $datesMatch = false;
                } elseif (null !== $entityStartDate && null !== $dtoStartDate) {
                    if ($entityStartDate->format('Y-m-d') !== $dtoStartDate->format('Y-m-d')) {
                        $datesMatch = false;
                    }
                }

                if ($datesMatch) {
                    $entityEndDate = $entity->getEndDate();
                    $dtoEndDate = $dto->endDate;
                    if ((null === $entityEndDate) !== (null === $dtoEndDate)) {
                        $datesMatch = false;
                    } elseif (null !== $entityEndDate && null !== $dtoEndDate) {
                        if ($entityEndDate->format('Y-m-d') !== $dtoEndDate->format('Y-m-d')) {
                            $datesMatch = false;
                        }
                    }
                }

                return $datesMatch
                    && $entity->getName() === $dto->name
                    && $entity->getDepartment() === $dto->department
                    && $entity->getTitle() === $dto->title
                    && $entity->getJobDescription() === $dto->jobDescription
                    && $entity->getType() === $dto->type;
            },
            function (ContactOrganization $entity, $dto) {
                $entity->setName($dto->name);
                $entity->setDepartment($dto->department);
                $entity->setTitle($dto->title);
                $entity->setJobDescription($dto->jobDescription);
                $entity->setType($dto->type);
                $entity->setStartDate($dto->startDate);
                $entity->setEndDate($dto->endDate);
            },
            function ($dto) use ($contact) {
                $entity = new ContactOrganization($contact);
                $entity->setName($dto->name);
                $entity->setDepartment($dto->department);
                $entity->setTitle($dto->title);
                $entity->setJobDescription($dto->jobDescription);
                $entity->setType($dto->type);
                $entity->setStartDate($dto->startDate);
                $entity->setEndDate($dto->endDate);

                return $entity;
            },
            !$merge,
        );

        $this->syncCollection(
            $contact->getContactBiographies(),
            $dto->biographies,
            function (ContactBiography $entity, $dto) {
                return $entity->getValue() === $dto->value && $entity->getType() === $dto->type;
            },
            function (ContactBiography $entity, $dto) {
                $entity->setValue($dto->value);
                $entity->setType($dto->type);
            },
            function ($dto) use ($contact) {
                $entity = new ContactBiography($contact);
                $entity->setValue($dto->value);
                $entity->setType($dto->type);

                return $entity;
            },
            !$merge,
        );

        $this->syncCollection(
            $contact->getContactGroups(),
            $dto->groups,
            function (ContactGroup $entity, Group $dtoGroup) {
                return $entity->getGroupResource() === $dtoGroup;
            },
            function (ContactGroup $entity, Group $_dtoGroup) {
                // Nothing to update
            },
            function (Group $dtoGroup) use ($contact) {
                $entity = new ContactGroup($contact);
                $entity->setGroupResource($dtoGroup);

                return $entity;
            },
            !$merge,
        );

        // Handle Avatar
        if (null !== $dto->avatarContent) {
            $avatar = $this->avatarManager->uploadContent(
                $contact,
                $dto->avatarContent,
                $dto->avatarMimeType ?? 'image/jpeg',
            );
            $this->entityManager->persist($avatar);
        }

        $this->entityManager->persist($contact);
        $this->entityManager->flush();

        return $contact;
    }
}
