<?php

namespace Ari\ApiResource;

use ApiPlatform\Metadata\ApiProperty;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use Ari\Entity\AuditLog;
use Ari\State\ContactTimelineProvider;
use Doctrine\Common\Collections\Collection;

#[ApiResource(
    shortName: 'ContactTimeline',
    operations: [
        new Get(
            uriTemplate: '/contacts/{id}/timeline',
            provider: ContactTimelineProvider::class,
            name: 'get_contact_timeline',
        ),
    ],
)]
class ContactTimeline
{
    public function __construct(
        #[ApiProperty(identifier: true)]
        public int $id,
        /**
         * @var Collection<int, AuditLog>
         */
        #[ApiProperty(readableLink: true)]
        public Collection $logs,
    ) {
    }
}
