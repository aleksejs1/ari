<?php

namespace Ari\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use Ari\ApiResource\Autocomplete;
use Ari\Service\AutocompleteService;

/**
 * @implements ProviderInterface<Autocomplete>
 */
class AutocompleteProvider implements ProviderInterface
{
    public function __construct(
        private readonly AutocompleteService $autocompleteService,
    ) {
    }

    #[\Override]
    public function provide(Operation $operation, array $uriVariables = [], array $context = []): object|array|null
    {
        $data = $this->autocompleteService->getAutocompleteData();

        return new Autocomplete(
            id: 'current',
            phoneTypes: $data['phoneTypes'],
            emailTypes: $data['emailTypes'],
            addressTypes: $data['addressTypes'],
            biographyTypes: $data['biographyTypes'],
            dateTypes: $data['dateTypes'],
            organizationTypes: $data['organizationTypes'],
            organizationNames: $data['organizationNames'],
            organizationTitles: $data['organizationTitles'],
            organizationDepartments: $data['organizationDepartments'],
        );
    }
}
