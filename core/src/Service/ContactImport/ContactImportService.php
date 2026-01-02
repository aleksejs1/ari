<?php

namespace App\Service\ContactImport;

use App\Dto\ContactImportDto;
use App\Entity\Contact;
use App\Entity\ContactAddress;
use App\Entity\ContactBiography;
use App\Entity\ContactDate;
use App\Entity\ContactEmailAdress;
use App\Entity\ContactName;
use App\Entity\ContactOrganization;
use App\Entity\ContactPhoneNumber;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\DependencyInjection\Attribute\AutowireIterator;

class ContactImportService
{
    /**
     * @param iterable<ContactDuplicateCheckerInterface> $checkers
     */
    public function __construct(
        #[AutowireIterator('app.contact_duplicate_checker')]
        private readonly iterable $checkers,
        private readonly EntityManagerInterface $entityManager,
    ) {
    }

    public function import(ContactImportDto $dto, User $user): ?Contact
    {
        foreach ($this->checkers as $checker) {
            if ($checker->isDuplicate($dto, $user)) {
                return null;
            }
        }

        $contact = new Contact();
        $contact->setUser($user);

        return $this->update($contact, $dto);
    }

    public function update(Contact $contact, ContactImportDto $dto): Contact
    {
        $contact->getContactNames()->clear();
        foreach ($dto->names as $nameDto) {
            $contactName = new ContactName();
            $contactName->setGiven($nameDto->given);
            $contactName->setFamily($nameDto->family);
            $contact->addContactName($contactName);
        }

        $contact->getContactDates()->clear();
        foreach ($dto->dates as $dateDto) {
            $contactDate = new ContactDate();
            $contactDate->setDate(
                $dateDto->date instanceof \DateTime ? $dateDto->date : \DateTime::createFromInterface($dateDto->date)
            );
            $contactDate->setText($dateDto->text);
            $contact->addContactDate($contactDate);
        }

        $contact->getContactEmailAdresses()->clear();
        foreach ($dto->emails as $emailDto) {
            $contactEmail = new ContactEmailAdress();
            $contactEmail->setValue($emailDto->value);
            $contactEmail->setType($emailDto->type);
            $contact->addContactEmailAdress($contactEmail);
        }

        $contact->getPhoneNumbers()->clear();
        foreach ($dto->phones as $phoneDto) {
            $contactPhone = new ContactPhoneNumber();
            $contactPhone->setValue($phoneDto->value);
            $contactPhone->setType($phoneDto->type);
            $contact->addPhoneNumber($contactPhone);
        }

        $contact->getContactAddresses()->clear();
        foreach ($dto->addresses as $addressDto) {
            $contactAddress = new ContactAddress();
            $contactAddress->setStreet($addressDto->street);
            $contactAddress->setStreetExtended($addressDto->streetExtended);
            $contactAddress->setCity($addressDto->city);
            $contactAddress->setRegion($addressDto->region);
            $contactAddress->setPostalCode($addressDto->postalCode);
            $contactAddress->setCountry($addressDto->country);
            $contactAddress->setCountryCode($addressDto->countryCode);
            $contactAddress->setType($addressDto->type);
            $contact->addContactAddress($contactAddress);
        }

        $contact->getContactOrganizations()->clear();
        foreach ($dto->organizations as $orgDto) {
            $contactOrg = new ContactOrganization();
            $contactOrg->setName($orgDto->name);
            $contactOrg->setDepartment($orgDto->department);
            $contactOrg->setTitle($orgDto->title);
            $contactOrg->setJobDescription($orgDto->jobDescription);
            $contactOrg->setType($orgDto->type);
            $contactOrg->setStartDate($orgDto->startDate);
            $contactOrg->setEndDate($orgDto->endDate);
            $contact->addContactOrganization($contactOrg);
        }

        $contact->getContactBiographies()->clear();
        foreach ($dto->biographies as $bioDto) {
            $contactBio = new ContactBiography();
            $contactBio->setValue($bioDto->value);
            $contactBio->setType($bioDto->type);
            $contact->addContactBiography($contactBio);
        }

        $this->entityManager->persist($contact);
        $this->entityManager->flush();

        return $contact;
    }
}
