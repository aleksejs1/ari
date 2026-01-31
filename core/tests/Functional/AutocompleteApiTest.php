<?php

namespace Ari\Tests\Functional;

use Ari\Entity\Contact;
use Ari\Entity\ContactEmailAdress;
use Ari\Entity\ContactOrganization;
use Ari\Entity\ContactPhoneNumber;
use Ari\Entity\User;
use Doctrine\ORM\EntityManagerInterface;

class AutocompleteApiTest extends AbstractApiTestCase
{
    public function testGetAutocomplete(): void
    {
        $container = self::getContainer();
        /** @var \Doctrine\Bundle\DoctrineBundle\Registry $doctrine */
        $doctrine = $container->get('doctrine');
        /** @var EntityManagerInterface $em */
        $em = $doctrine->getManager();

        /** @var User $user */
        $user = $em->getRepository(User::class)->findOneBy(['uuid' => $this->userUuid]);

        $contact = new Contact();
        $contact->setUser($user);
        $em->persist($contact);

        $phone = new ContactPhoneNumber($contact);
        $phone->setType('Work');
        $phone->setValue('123456');
        $em->persist($phone);

        $email = new ContactEmailAdress($contact);
        $email->setType('Personal');
        $email->setValue('test@example.com');
        $em->persist($email);

        $org = new ContactOrganization($contact);
        $org->setName('Google');
        $org->setTitle('Engineer');
        $org->setDepartment('Search');
        $org->setType('Primary');
        $em->persist($org);

        $em->flush();

        $client = static::createClient();
        $response = $client->request('GET', '/api/autocomplete', [
            'headers' => ['Authorization' => 'Bearer ' . $this->token],
        ]);

        self::assertResponseIsSuccessful();
        $data = $response->toArray();

        self::assertContains('Work', $data['phoneTypes']);
        self::assertContains('Personal', $data['emailTypes']);
        self::assertContains('Google', $data['organizationNames']);
        self::assertContains('Engineer', $data['organizationTitles']);
        self::assertContains('Search', $data['organizationDepartments']);
        self::assertContains('Primary', $data['organizationTypes']);
    }
}
