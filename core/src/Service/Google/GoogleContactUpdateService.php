<?php

namespace App\Service\Google;

use App\Entity\Contact;
use App\Entity\UserPref;
use App\Repository\ImportMappingRepository;
use App\Repository\TokenStorageRepository;
use App\Repository\UserPrefRepository;
use Symfony\Contracts\HttpClient\HttpClientInterface;

class GoogleContactUpdateService
{
    public function __construct(
        private readonly TokenStorageRepository $tokenStorageRepository,
        private readonly ImportMappingRepository $importMappingRepository,
        private readonly UserPrefRepository $userPrefRepository,
        private readonly GoogleContactsService $googleContactsService,
        private readonly HttpClientInterface $httpClient,
    ) {
    }

    public function updateContact(Contact $contact): void
    {
        $user = $contact->getUser();

        // 1. Check preference
        $pref = $this->userPrefRepository->findOneBy([
            'user' => $user,
            'type' => UserPref::TYPE_GOOGLE_SYNC_ON_UPDATE,
        ]);

        if (null === $pref || '1' !== $pref->getValue()) {
            return;
        }

        // 2. Check mapping
        $mapping = $this->importMappingRepository->findOneBy([
            'user' => $user,
            'contact' => $contact,
            'type' => 'google',
        ]);

        if (null === $mapping) {
            return;
        }

        $resourceName = $mapping->getExternalId();
        if (null === $resourceName) {
            return;
        }

        // 3. Get token
        $tokenStorage = $this->tokenStorageRepository->findOneBy(['user' => $user, 'type' => 'google']);
        if (null === $tokenStorage) {
            return;
        }

        $accessToken = $this->googleContactsService->getValidAccessToken($tokenStorage);

        // 4. Prepare data for Google
        $phoneNumbers = [];
        foreach ($contact->getPhoneNumbers() as $phoneNumber) {
            $phoneNumbers[] = [
                'value' => $phoneNumber->getValue(),
                'type' => $phoneNumber->getType() ?? 'other',
            ];
        }

        $names = [];
        foreach ($contact->getContactNames() as $name) {
            $names[] = [
                'givenName' => $name->getGiven() ?? '',
                'familyName' => $name->getFamily() ?? '',
            ];
        }

        $emailAddresses = [];
        foreach ($contact->getContactEmailAdresses() as $email) {
            $emailAddresses[] = [
                'value' => $email->getValue(),
                'type' => $email->getType() ?? 'other',
            ];
        }

        // Send GET request to fetch the latest etag
        $personUrl = sprintf('https://people.googleapis.com/v1/%s', $resourceName);
        $getResponse = $this->httpClient->request('GET', $personUrl, [
            'headers' => [
                'Authorization' => 'Bearer ' . $accessToken,
            ],
            'query' => [
                'personFields' => 'metadata',
            ],
        ]);

        $personData = $getResponse->toArray();
        $etag = $personData['etag'] ?? null;

        if (null === $etag) {
            return;
        }

        // Send PATCH request to Google People API
        $url = sprintf('https://people.googleapis.com/v1/%s:updateContact', $resourceName);

        $this->httpClient->request('PATCH', $url, [
            'headers' => [
                'Authorization' => 'Bearer ' . $accessToken,
            ],
            'query' => [
                'updatePersonFields' => 'phoneNumbers,names,emailAddresses',
            ],
            'json' => [
                'etag' => $etag,
                'phoneNumbers' => $phoneNumbers,
                'names' => $names,
                'emailAddresses' => $emailAddresses,
            ],
        ]);
    }
}
