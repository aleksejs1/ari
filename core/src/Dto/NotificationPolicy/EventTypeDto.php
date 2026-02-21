<?php

namespace Ari\Dto\NotificationPolicy;

use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiProperty;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\QueryParameter;
use Ari\State\EventTypeProvider;
use Symfony\Component\Serializer\Attribute\Groups;

#[ApiResource(
    shortName: 'EventType',
    normalizationContext: ['groups' => ['event_type:read']],
    operations: [
        new GetCollection(
            uriTemplate: '/notification-policy/event-types',
            provider: EventTypeProvider::class,
            name: 'event_types',
            parameters: [
                'search' => new QueryParameter(property: 'text', filter: SearchFilter::class),
            ],
        ),
    ],
) ]
class EventTypeDto
{
    #[ApiProperty(identifier: true)]
    #[ApiFilter(SearchFilter::class, strategy: 'partial')]
    #[Groups(['event_type:read'])]
    public string $text;

    public function __construct(string $text)
    {
        $this->text = $text;
    }
}
