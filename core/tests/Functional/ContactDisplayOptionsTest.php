<?php

declare(strict_types=1);

namespace Ari\Tests\Functional;

use Ari\Entity\Contact;
use Ari\Entity\ContactDate;
use Ari\Entity\ContactEmailAdress;
use Ari\Entity\ContactName;
use Ari\Entity\ContactPhoneNumber;
use Ari\Entity\User;

class ContactDisplayOptionsTest extends AbstractApiTestCase
{
    private const ENDPOINT = '/api/contacts/display-options';

    // ── Happy path ────────────────────────────────────────────────────────────

    public function testReturnsDistinctValuesForCurrentUser(): void
    {
        $client = static::createClient();
        $em = $this->getEntityManager();

        /** @var User $user */
        $user = $em->getRepository(User::class)->findOneBy(['uuid' => $this->userUuid]);

        // Create a contact with sub-resources
        $contact = new Contact();
        $contact->setUser($user);
        $em->persist($contact);

        $name = new ContactName($contact);
        $name->setLocale('ru');
        $em->persist($name);

        $phone = new ContactPhoneNumber($contact);
        $phone->setType('mobile');
        $phone->setValue('+1234567890');
        $em->persist($phone);

        $email = new ContactEmailAdress($contact);
        $email->setType('work');
        $email->setValue('test@example.com');
        $em->persist($email);

        $date = new ContactDate($contact);
        $date->setText('Birthday');
        $em->persist($date);

        $em->flush();

        $response = $client->request('GET', self::ENDPOINT, [
            'auth_bearer' => $this->token,
        ]);

        self::assertResponseIsSuccessful();
        $data = $response->toArray();

        self::assertArrayHasKey('nameLocales', $data);
        self::assertArrayHasKey('phoneTypes', $data);
        self::assertArrayHasKey('emailTypes', $data);
        self::assertArrayHasKey('dateTexts', $data);

        self::assertContains('ru', $data['nameLocales']);
        self::assertContains('mobile', $data['phoneTypes']);
        self::assertContains('work', $data['emailTypes']);
        self::assertContains('Birthday', $data['dateTexts']);
    }

    public function testMultipleDistinctValuesSortedAlphabetically(): void
    {
        $client = static::createClient();
        $em = $this->getEntityManager();

        /** @var User $user */
        $user = $em->getRepository(User::class)->findOneBy(['uuid' => $this->userUuid]);

        $contact = new Contact();
        $contact->setUser($user);
        $em->persist($contact);

        // Add two phone types out of alphabetical order
        $phone1 = new ContactPhoneNumber($contact);
        $phone1->setType('work');
        $phone1->setValue('+1000000001');
        $em->persist($phone1);

        $phone2 = new ContactPhoneNumber($contact);
        $phone2->setType('mobile');
        $phone2->setValue('+1000000002');
        $em->persist($phone2);

        $em->flush();

        $response = $client->request('GET', self::ENDPOINT, [
            'auth_bearer' => $this->token,
        ]);

        self::assertResponseIsSuccessful();
        $phoneTypes = $response->toArray()['phoneTypes'];

        // Should be sorted: mobile before work
        $mobileIndex = array_search('mobile', $phoneTypes, true);
        $workIndex = array_search('work', $phoneTypes, true);
        self::assertNotFalse($mobileIndex);
        self::assertNotFalse($workIndex);
        self::assertLessThan($workIndex, $mobileIndex);
    }

    // ── Empty result ──────────────────────────────────────────────────────────

    public function testReturnsEmptyArraysWhenNoTypedData(): void
    {
        $client = static::createClient();
        $em = $this->getEntityManager();

        /** @var User $user */
        $user = $em->getRepository(User::class)->findOneBy(['uuid' => $this->userUuid]);

        // Create a contact with no sub-resources
        $contact = new Contact();
        $contact->setUser($user);
        $em->persist($contact);
        $em->flush();

        $response = $client->request('GET', self::ENDPOINT, [
            'auth_bearer' => $this->token,
        ]);

        self::assertResponseIsSuccessful();
        $data = $response->toArray();

        self::assertSame([], $data['nameLocales']);
        self::assertSame([], $data['phoneTypes']);
        self::assertSame([], $data['emailTypes']);
        self::assertSame([], $data['dateTexts']);
    }

    public function testNullAndEmptyTypesAreExcluded(): void
    {
        $client = static::createClient();
        $em = $this->getEntityManager();

        /** @var User $user */
        $user = $em->getRepository(User::class)->findOneBy(['uuid' => $this->userUuid]);

        $contact = new Contact();
        $contact->setUser($user);
        $em->persist($contact);

        // Phone with null type — should not appear in phoneTypes
        $phone = new ContactPhoneNumber($contact);
        $phone->setType(null);
        $phone->setValue('+9990000000');
        $em->persist($phone);

        $em->flush();

        $response = $client->request('GET', self::ENDPOINT, [
            'auth_bearer' => $this->token,
        ]);

        self::assertResponseIsSuccessful();
        $data = $response->toArray();

        self::assertSame([], $data['phoneTypes']);
    }

    // ── Auth required ─────────────────────────────────────────────────────────

    public function testRequiresAuthentication(): void
    {
        $client = static::createClient();
        $client->request('GET', self::ENDPOINT);
        self::assertResponseStatusCodeSame(401);
    }

    // ── API key scope enforcement ─────────────────────────────────────────────

    public function testApiKeyWithContactsReadScopeReturns200(): void
    {
        $client = static::createClient();

        // Create an API key with contacts:read scope via the API
        $createResponse = $client->request('POST', '/api/api_keys', [
            'auth_bearer' => $this->token,
            'json' => [
                'name' => 'Display Options Read Test',
                'scopes' => ['contacts:read'],
            ],
        ]);
        self::assertResponseStatusCodeSame(201);
        $rawToken = $createResponse->toArray()['token'];

        $response = $client->request('GET', self::ENDPOINT, [
            'headers' => ['Authorization' => 'Bearer ' . $rawToken],
        ]);

        self::assertResponseIsSuccessful();
        $data = $response->toArray();
        self::assertArrayHasKey('nameLocales', $data);
    }

    public function testApiKeyWithoutContactsReadScopeReturns403(): void
    {
        $client = static::createClient();

        // Create an API key with a scope that does NOT include contacts:read
        $createResponse = $client->request('POST', '/api/api_keys', [
            'auth_bearer' => $this->token,
            'json' => [
                'name' => 'No Contacts Scope Test',
                'scopes' => ['groups:read'],
            ],
        ]);
        self::assertResponseStatusCodeSame(201);
        $rawToken = $createResponse->toArray()['token'];

        $client->request('GET', self::ENDPOINT, [
            'headers' => ['Authorization' => 'Bearer ' . $rawToken],
        ]);

        self::assertResponseStatusCodeSame(403);
    }

    // ── Tenant isolation ──────────────────────────────────────────────────────

    public function testTenantIsolation(): void
    {
        $client = static::createClient();
        $em = $this->getEntityManager();

        /** @var User $userA */
        $userA = $em->getRepository(User::class)->findOneBy(['uuid' => $this->userUuid]);

        // Create data for User A
        $contactA = new Contact();
        $contactA->setUser($userA);
        $em->persist($contactA);

        $phoneA = new ContactPhoneNumber($contactA);
        $phoneA->setType('mobile');
        $phoneA->setValue('+1111111111');
        $em->persist($phoneA);

        $em->flush();

        // Create User B with their own data
        $userBUuid = 'display-opts-b-' . bin2hex(random_bytes(4));
        $userB = $this->createUser($userBUuid, 'pass');
        $tokenB = $this->getToken((string) $userB->getUuid(), 'pass');

        // Re-fetch userB to ensure it is managed by the current EM session
        /** @var User $userB */
        $userB = $em->getRepository(User::class)->findOneBy(['uuid' => $userBUuid]);

        $contactB = new Contact();
        $contactB->setUser($userB);
        $em->persist($contactB);

        $phoneB = new ContactPhoneNumber($contactB);
        $phoneB->setType('fax');
        $phoneB->setValue('+2222222222');
        $em->persist($phoneB);

        $em->flush();

        // User A should see 'mobile' but NOT 'fax'
        $responseA = $client->request('GET', self::ENDPOINT, [
            'auth_bearer' => $this->token,
        ]);
        self::assertResponseIsSuccessful();
        $phoneTypesA = $responseA->toArray()['phoneTypes'];
        self::assertContains('mobile', $phoneTypesA);
        self::assertNotContains('fax', $phoneTypesA);

        // User B should see 'fax' but NOT 'mobile'
        $responseB = $client->request('GET', self::ENDPOINT, [
            'auth_bearer' => $tokenB,
        ]);
        self::assertResponseIsSuccessful();
        $phoneTypesB = $responseB->toArray()['phoneTypes'];
        self::assertContains('fax', $phoneTypesB);
        self::assertNotContains('mobile', $phoneTypesB);
    }
}
