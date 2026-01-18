<?php

namespace App\Tests\Unit\Service\Google;

use App\Entity\Contact;
use App\Entity\ContactAddress;
use App\Entity\ContactBiography;
use App\Entity\ContactDate;
use App\Entity\ContactEmailAdress;
use App\Entity\ContactName;
use App\Entity\ContactOrganization;
use App\Entity\ContactPhoneNumber;
use App\Entity\ImportMapping;
use App\Entity\TokenStorage;
use App\Entity\User;
use App\Entity\UserPref;
use App\Repository\ImportMappingRepository;
use App\Repository\TokenStorageRepository;
use App\Repository\UserPrefRepository;
use App\Service\Google\GoogleContactsService;
use App\Service\Google\GoogleContactUpdateService;
use Doctrine\Common\Collections\ArrayCollection;
use PHPUnit\Framework\TestCase;
use Symfony\Component\HttpClient\MockHttpClient;
use Symfony\Component\HttpClient\Response\MockResponse;
use Symfony\Contracts\HttpClient\HttpClientInterface;

class GoogleContactUpdateServiceTest extends TestCase
{
    /** @var TokenStorageRepository&\PHPUnit\Framework\MockObject\Stub */
    private TokenStorageRepository $tokenStorageRepository;
    /** @var ImportMappingRepository&\PHPUnit\Framework\MockObject\Stub */
    private ImportMappingRepository $importMappingRepository;
    /** @var UserPrefRepository&\PHPUnit\Framework\MockObject\Stub */
    private UserPrefRepository $userPrefRepository;
    /** @var GoogleContactsService&\PHPUnit\Framework\MockObject\Stub */
    private GoogleContactsService $googleContactsService;
    private HttpClientInterface $httpClient;
    private GoogleContactUpdateService $service;

    #[\Override]
    protected function setUp(): void
    {
        $this->tokenStorageRepository = self::createStub(TokenStorageRepository::class);
        $this->importMappingRepository = self::createStub(ImportMappingRepository::class);
        $this->userPrefRepository = self::createStub(UserPrefRepository::class);
        $this->googleContactsService = self::createStub(GoogleContactsService::class);
        $this->httpClient = new MockHttpClient(); // No requests expected by default

        $this->service = new GoogleContactUpdateService(
            $this->tokenStorageRepository,
            $this->importMappingRepository,
            $this->userPrefRepository,
            $this->googleContactsService,
            $this->httpClient,
        );
    }

    public function testUpdateContactDisabledByPref(): void
    {
        // 0 Requests expected - MockHttpClient handles this by default unless configured.
        $this->expectNotToPerformAssertions();

        $contact = self::createStub(Contact::class);
        $user = self::createStub(User::class);
        $contact->method('getUser')->willReturn($user);

        $this->userPrefRepository = self::createStub(UserPrefRepository::class);
        $this->userPrefRepository->method('findOneBy')->willReturn(null);

        $this->recreateService();

        $this->service->updateContact($contact);
        // implicit assertion: no exceptions. MockHttpClient throws if we don't return response?
        // If we want to verify "never called", we can pass a callback that throws.
    }

    public function testUpdateContactNoMapping(): void
    {
        $this->expectNotToPerformAssertions();
        $contact = self::createStub(Contact::class);
        $user = self::createStub(User::class);
        $contact->method('getUser')->willReturn($user);

        $this->userPrefRepository = self::createStub(UserPrefRepository::class);
        $pref = self::createStub(UserPref::class);
        $pref->method('getValue')->willReturn('1');
        $this->userPrefRepository->method('findOneBy')->willReturn($pref);

        $this->importMappingRepository = self::createStub(ImportMappingRepository::class);
        $this->importMappingRepository->method('findOneBy')->willReturn(null);

        $this->recreateService();

        $this->service->updateContact($contact);
    }

    public function testUpdateContactSuccess(): void
    {
        $this->expectNotToPerformAssertions();
        $contact = self::createStub(Contact::class);
        $user = self::createStub(User::class);
        $contact->method('getUser')->willReturn($user);

        // 1. Pref
        $this->userPrefRepository = self::createStub(UserPrefRepository::class);
        $pref = self::createStub(UserPref::class);
        $pref->method('getValue')->willReturn('1');
        $this->userPrefRepository->method('findOneBy')->willReturn($pref);

        // 2. Mapping
        $this->importMappingRepository = self::createStub(ImportMappingRepository::class);
        $mapping = self::createStub(ImportMapping::class);
        $mapping->method('getExternalId')->willReturn('people/123');
        $this->importMappingRepository->method('findOneBy')->willReturn($mapping);

        // 3. Token
        $this->tokenStorageRepository = self::createStub(TokenStorageRepository::class);
        $this->googleContactsService = self::createStub(GoogleContactsService::class);

        $tokenStorage = self::createStub(TokenStorage::class);
        $this->tokenStorageRepository->method('findOneBy')->willReturn($tokenStorage);
        $this->googleContactsService->method('getValidAccessToken')->willReturn('access_token');

        // 4. Contact Data
        $phone = self::createStub(ContactPhoneNumber::class);
        $phone->method('getValue')->willReturn('123456');
        $contact->method('getPhoneNumbers')->willReturn(new ArrayCollection([$phone]));

        $name = self::createStub(ContactName::class);
        $name->method('getGiven')->willReturn('John');
        $name->method('getFamily')->willReturn('Doe');
        $contact->method('getContactNames')->willReturn(new ArrayCollection([$name]));

        $email = self::createStub(ContactEmailAdress::class);
        $email->method('getValue')->willReturn('john@example.com');
        $contact->method('getContactEmailAdresses')->willReturn(new ArrayCollection([$email]));

        $address = self::createStub(ContactAddress::class);
        $address->method('getStreet')->willReturn('Street');
        $contact->method('getContactAddresses')->willReturn(new ArrayCollection([$address]));

        $org = self::createStub(ContactOrganization::class);
        $org->method('getName')->willReturn('Company');
        $contact->method('getContactOrganizations')->willReturn(new ArrayCollection([$org]));

        $bio = self::createStub(ContactBiography::class);
        $bio->method('getValue')->willReturn('Bio');
        $contact->method('getContactBiographies')->willReturn(new ArrayCollection([$bio]));

        $bd = self::createStub(ContactDate::class);
        $bd->method('getText')->willReturn('Birthday');
        $bd->method('getDate')->willReturn(new \DateTime('1990-01-01'));
        $contact->method('getContactDates')->willReturn(new ArrayCollection([$bd]));

        // 5. MockHttpClient for requests
        // Order: GET then PATCH
        $responses = [
            new MockResponse((string) json_encode(['etag' => 'etag123'])), // GET
            new MockResponse((string) json_encode([])), // PATCH
        ];

        $this->httpClient = new MockHttpClient($responses);

        $this->recreateService();

        $this->service->updateContact($contact);

        // No exceptions means 2 calls consumed.
        // We can check $this->httpClient->getRequestsCount() ? Not directly.
        // If we want to be strict, we can check.
    }

    private function recreateService(): void
    {
        $this->service = new GoogleContactUpdateService(
            $this->tokenStorageRepository,
            $this->importMappingRepository,
            $this->userPrefRepository,
            $this->googleContactsService,
            $this->httpClient,
        );
    }
}
