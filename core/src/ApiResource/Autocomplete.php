<?php

namespace App\ApiResource;

use ApiPlatform\Metadata\ApiProperty;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\OpenApi\Model\Operation;
use App\State\AutocompleteProvider;

#[ApiResource(
    shortName: 'Autocomplete',
    operations: [
        new Get(
            uriTemplate: '/autocomplete',
            provider: AutocompleteProvider::class,
            name: 'get_autocomplete',
            openapi: new Operation(
                summary: 'Get autocomplete suggestions for contact forms',
                description: 'Returns distinct types and values already used by the user across contacts.',
            ),
            security: "is_granted('ROLE_USER')",
        ),
    ],
)]
class Autocomplete
{
    public function __construct(
        #[ApiProperty(identifier: true)]
        public string $id = 'current',
        /**
         * @var string[]
         */
        public array $phoneTypes = [],
        /**
         * @var string[]
         */
        public array $emailTypes = [],
        /**
         * @var string[]
         */
        public array $addressTypes = [],
        /**
         * @var string[]
         */
        public array $biographyTypes = [],
        /**
         * @var string[]
         */
        public array $dateTypes = [],
        /**
         * @var string[]
         */
        public array $organizationTypes = [],
        /**
         * @var string[]
         */
        public array $organizationNames = [],
        /**
         * @var string[]
         */
        public array $organizationTitles = [],
        /**
         * @var string[]
         */
        public array $organizationDepartments = [],
    ) {
    }
}
