<?php

namespace App\Tests\Unit\Service\VCard;

use App\Entity\Contact;
use App\Entity\ContactAddress;
use App\Entity\ContactBiography;
use App\Entity\ContactDate;
use App\Entity\ContactEmailAdress;
use App\Entity\ContactName;
use App\Entity\ContactOrganization;
use App\Entity\ContactPhoneNumber;
use App\Service\VCard\VCardService;
use PHPUnit\Framework\TestCase;

class VCardServiceTest extends TestCase
{
    private VCardService $service;

    #[\Override]
    protected function setUp(): void
    {
        $this->service = new VCardService();
    }

    public function testGenerateVCardWithBasicInfo(): void
    {
        $contact = new Contact();
        
        $name = new ContactName();
        $name->setGiven('John');
        $name->setFamily('Doe');
        $contact->addContactName($name);

        $phone = new ContactPhoneNumber();
        $phone->setValue('+123456789');
        $phone->setType('mobile');
        $contact->addPhoneNumber($phone);

        $email = new ContactEmailAdress();
        $email->setValue('john@example.com');
        $email->setType('work');
        $contact->addContactEmailAdress($email);

        $vcard = $this->service->generateVCard($contact);

        self::assertStringContainsString('BEGIN:VCARD', $vcard);
        self::assertStringContainsString('VERSION:4.0', $vcard);
        self::assertStringContainsString('FN:John Doe', $vcard);
        self::assertStringContainsString('N:Doe;John;;;', $vcard);
        self::assertStringContainsString('TEL;TYPE=cell:+123456789', $vcard);
        self::assertStringContainsString('EMAIL;TYPE=work:john@example.com', $vcard);
        self::assertStringContainsString('END:VCARD', $vcard);
    }

    public function testGenerateVCardWithFullData(): void
    {
        $contact = new Contact();
        
        // Name
        $name = new ContactName();
        $name->setGiven('Alice');
        $name->setFamily('Smith');
        $contact->addContactName($name);

        // Address
        $address = new ContactAddress();
        $address->setStreet('Main St 1');
        $address->setCity('New York');
        $address->setRegion('NY');
        $address->setPostalCode('10001');
        $address->setCountry('USA');
        $address->setType('home');
        $contact->addContactAddress($address);

        // Organization
        $org = new ContactOrganization();
        $org->setName('Acme Corp');
        $org->setDepartment('IT');
        $org->setTitle('Manager');
        $contact->addContactOrganization($org);

        // Bio
        $bio = new ContactBiography();
        $bio->setValue('A great person.');
        $contact->addContactBiography($bio);

        // Dates
        $birthday = new ContactDate();
        $birthday->setDate(new \DateTime('1990-01-01'));
        $birthday->setText('Birthday');
        $contact->addContactDate($birthday);

        $anniversary = new ContactDate();
        $anniversary->setDate(new \DateTime('2020-05-20'));
        $anniversary->setText('Wedding');
        $contact->addContactDate($anniversary);

        $vcard = $this->service->generateVCard($contact);

        self::assertStringContainsString('ADR;TYPE=home:;;Main St 1;New York;NY;10001;USA', $vcard);
        self::assertStringContainsString('ORG:Acme Corp;IT', $vcard);
        self::assertStringContainsString('TITLE:Manager', $vcard);
        self::assertStringContainsString('NOTE:A great person.', $vcard);
        self::assertStringContainsString('BDAY:19900101', $vcard);
        self::assertStringContainsString('ANNIVERSARY;X-LABEL=Wedding:20200520', $vcard);
    }

    public function testTypeMapping(): void
    {
        $contact = new Contact();
        
        $phone1 = new ContactPhoneNumber();
        $phone1->setValue('1');
        $phone1->setType('WORK'); // uppercase to test normalization
        $contact->addPhoneNumber($phone1);

        $phone2 = new ContactPhoneNumber();
        $phone2->setValue('2');
        $phone2->setType('home');
        $contact->addPhoneNumber($phone2);

        $phone3 = new ContactPhoneNumber();
        $phone3->setValue('3');
        $phone3->setType('fax');
        $contact->addPhoneNumber($phone3);

        $phone4 = new ContactPhoneNumber();
        $phone4->setValue('4');
        $phone4->setType('custom');
        $contact->addPhoneNumber($phone4);

        $vcard = $this->service->generateVCard($contact);

        self::assertStringContainsString('TEL;TYPE=work:1', $vcard);
        self::assertStringContainsString('TEL;TYPE=home:2', $vcard);
        self::assertStringContainsString('TEL;TYPE=fax:3', $vcard);
        self::assertStringContainsString('TEL;TYPE=custom:4', $vcard);
    }
}
