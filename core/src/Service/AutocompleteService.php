<?php

namespace App\Service;

use App\Repository\ContactAddressRepository;
use App\Repository\ContactBiographyRepository;
use App\Repository\ContactDateRepository;
use App\Repository\ContactEmailAdressRepository;
use App\Repository\ContactOrganizationRepository;
use App\Repository\ContactPhoneNumberRepository;

class AutocompleteService
{
    public function __construct(
        private readonly ContactPhoneNumberRepository $phoneNumberRepository,
        private readonly ContactEmailAdressRepository $emailAdressRepository,
        private readonly ContactAddressRepository $addressRepository,
        private readonly ContactBiographyRepository $biographyRepository,
        private readonly ContactDateRepository $dateRepository,
        private readonly ContactOrganizationRepository $organizationRepository,
    ) {
    }

    /**
     * @return array<string, string[]>
     */
    public function getAutocompleteData(): array
    {
        return [
            'phoneTypes' => $this->phoneNumberRepository->getDistinctValues('type'),
            'emailTypes' => $this->emailAdressRepository->getDistinctValues('type'),
            'addressTypes' => $this->addressRepository->getDistinctValues('type'),
            'biographyTypes' => $this->biographyRepository->getDistinctValues('type'),
            'dateTypes' => $this->dateRepository->getDistinctValues('text'),
            'organizationTypes' => $this->organizationRepository->getDistinctValues('type'),
            'organizationNames' => $this->organizationRepository->getDistinctValues('name'),
            'organizationTitles' => $this->organizationRepository->getDistinctValues('title'),
            'organizationDepartments' => $this->organizationRepository->getDistinctValues('department'),
        ];
    }
}
