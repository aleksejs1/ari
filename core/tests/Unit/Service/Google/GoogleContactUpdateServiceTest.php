<?php

namespace App\Tests\Unit\Service\Google;

use App\Entity\Contact;
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
use PHPUnit\Framework\Attributes\AllowMockingUnknownTypes;
use PHPUnit\Framework\TestCase;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use Symfony\Contracts\HttpClient\ResponseInterface;

#[\PHPUnit\Framework\Attributes\AllowMockObjectsWithoutExpectations]
class GoogleContactUpdateServiceTest extends TestCase
{
    public function testUpdateContactPhonesSkipsIfPrefDisabled(): void
    {
        $user = $this->createMock(User::class);
        $contact = $this->createMock(Contact::class);
        $contact->method('getUser')->willReturn($user);

        $userPrefRepository = $this->createMock(UserPrefRepository::class);
        $userPrefRepository->method('findOneBy')->willReturn(null);

        $tokenStorageRepository = $this->createMock(TokenStorageRepository::class);
        $importMappingRepository = $this->createMock(ImportMappingRepository::class);
        $googleContactsService = $this->createMock(GoogleContactsService::class);
        $httpClient = $this->createMock(HttpClientInterface::class);
        // HttpClient should never be called
        $httpClient->expects($this->never())->method('request');

        $service = new GoogleContactUpdateService(
            $tokenStorageRepository,
            $importMappingRepository,
            $userPrefRepository,
            $googleContactsService,
            $httpClient
        );

        $service->updateContactPhones($contact);
    }

    public function testUpdateContactPhonesSkipsIfNoMapping(): void
    {
        $user = $this->createMock(User::class);
        $contact = $this->createMock(Contact::class);
        $contact->method('getUser')->willReturn($user);

        $pref = new UserPref();
        $pref->setType(UserPref::TYPE_GOOGLE_SYNC_ON_UPDATE);
        $pref->setValue('1');

        $userPrefRepository = $this->createMock(UserPrefRepository::class);
        $userPrefRepository->method('findOneBy')->willReturn($pref);

        $importMappingRepository = $this->createMock(ImportMappingRepository::class);
        $importMappingRepository->method('findOneBy')->willReturn(null);

        $tokenStorageRepository = $this->createMock(TokenStorageRepository::class);
        $googleContactsService = $this->createMock(GoogleContactsService::class);
        $httpClient = $this->createMock(HttpClientInterface::class);
        // HttpClient should never be called
        $httpClient->expects($this->never())->method('request');

        $service = new GoogleContactUpdateService(
            $tokenStorageRepository,
            $importMappingRepository,
            $userPrefRepository,
            $googleContactsService,
            $httpClient
        );

        $service->updateContactPhones($contact);
    }

    public function testUpdateContactPhonesSkipsIfNoToken(): void
    {
        $user = $this->createMock(User::class);
        $contact = $this->createMock(Contact::class);
        $contact->method('getUser')->willReturn($user);
        $contact->method('getPhoneNumbers')->willReturn(new \Doctrine\Common\Collections\ArrayCollection());

        $pref = new UserPref();
        $pref->setType(UserPref::TYPE_GOOGLE_SYNC_ON_UPDATE);
        $pref->setValue('1');

        $userPrefRepository = $this->createMock(UserPrefRepository::class);
        $userPrefRepository->method('findOneBy')->willReturn($pref);

        $mapping = $this->createMock(ImportMapping::class);
        $mapping->method('getExternalId')->willReturn('people/c123');

        $importMappingRepository = $this->createMock(ImportMappingRepository::class);
        $importMappingRepository->method('findOneBy')->willReturn($mapping);

        $tokenStorageRepository = $this->createMock(TokenStorageRepository::class);
        $tokenStorageRepository->method('findOneBy')->willReturn(null);

        $googleContactsService = $this->createMock(GoogleContactsService::class);
        $httpClient = $this->createMock(HttpClientInterface::class);
        // HttpClient should never be called
        $httpClient->expects($this->never())->method('request');

        $service = new GoogleContactUpdateService(
            $tokenStorageRepository,
            $importMappingRepository,
            $userPrefRepository,
            $googleContactsService,
            $httpClient
        );

        $service->updateContactPhones($contact);
    }

    public function testUpdateContactPhonesSendsRequest(): void
    {
        $user = $this->createMock(User::class);

        $phone = $this->createMock(ContactPhoneNumber::class);
        $phone->method('getValue')->willReturn('+1234567890');
        $phone->method('getType')->willReturn('mobile');

        $contact = $this->createMock(Contact::class);
        $contact->method('getUser')->willReturn($user);
        $contact->method('getPhoneNumbers')->willReturn(new \Doctrine\Common\Collections\ArrayCollection([$phone]));

        $pref = new UserPref();
        $pref->setType(UserPref::TYPE_GOOGLE_SYNC_ON_UPDATE);
        $pref->setValue('1');

        $userPrefRepository = $this->createMock(UserPrefRepository::class);
        $userPrefRepository->method('findOneBy')->willReturn($pref);

        $mapping = $this->createMock(ImportMapping::class);
        $mapping->method('getExternalId')->willReturn('people/c123');

        $importMappingRepository = $this->createMock(ImportMappingRepository::class);
        $importMappingRepository->method('findOneBy')->willReturn($mapping);

        $tokenStorage = $this->createMock(TokenStorage::class);

        $tokenStorageRepository = $this->createMock(TokenStorageRepository::class);
        $tokenStorageRepository->method('findOneBy')->willReturn($tokenStorage);

        $googleContactsService = $this->createMock(GoogleContactsService::class);
        $googleContactsService->method('getValidAccessToken')->willReturn('test-access-token');

        $getResponse = $this->createMock(ResponseInterface::class);
        $getResponse->method('toArray')->willReturn(['etag' => 'test-etag']);

        $patchResponse = $this->createMock(ResponseInterface::class);

        $httpClient = $this->createMock(HttpClientInterface::class);
        $httpClient->expects($this->exactly(2))->method('request')
            ->willReturnCallback(function (string $method) use ($getResponse, $patchResponse) {
                if ('GET' === $method) {
                    return $getResponse;
                }

                return $patchResponse;
            });

        $service = new GoogleContactUpdateService(
            $tokenStorageRepository,
            $importMappingRepository,
            $userPrefRepository,
            $googleContactsService,
            $httpClient
        );

        $service->updateContactPhones($contact);
    }
}
