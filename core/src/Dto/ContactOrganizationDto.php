<?php

namespace Ari\Dto;

class ContactOrganizationDto
{
    public function __construct(
        public readonly string $name = '',
        public readonly string $department = '',
        public readonly string $title = '',
        public readonly string $jobDescription = '',
        public readonly string $type = '',
        public readonly ?\DateTime $startDate = null,
        public readonly ?\DateTime $endDate = null,
    ) {
    }
}
