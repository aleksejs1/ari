<?php

namespace App\Dto;

class ContactImportDto
{
    /**
     * @param ContactNameDto[]         $names
     * @param ContactDateDto[]         $dates
     * @param ContactEmailDto[]        $emails
     * @param ContactPhoneDto[]        $phones
     * @param ContactAddressDto[]      $addresses
     * @param ContactOrganizationDto[] $organizations
     * @param ContactBiographyDto[]    $biographies
     * @param \App\Entity\Group[]      $groups
     */
    public function __construct(
        public readonly array $names = [],
        public readonly array $dates = [],
        public readonly array $emails = [],
        public readonly array $phones = [],
        public readonly array $addresses = [],
        public readonly array $organizations = [],
        public readonly array $biographies = [],
        public readonly array $groups = [],
        public readonly ?string $avatarContent = null,
        public readonly ?string $avatarMimeType = null,
    ) {
    }
}
