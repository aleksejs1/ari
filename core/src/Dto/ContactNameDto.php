<?php

namespace App\Dto;

class ContactNameDto
{
    public function __construct(
        public readonly string $family,
        public readonly string $given,
    ) {
    }
}
