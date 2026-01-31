<?php

namespace Ari\Dto;

class ContactAddressDto
{
    public function __construct(
        public readonly string $street = '',
        public readonly string $streetExtended = '',
        public readonly string $city = '',
        public readonly string $region = '',
        public readonly string $postalCode = '',
        public readonly string $country = '',
        public readonly string $countryCode = '',
        public readonly string $type = '',
    ) {
    }
}
