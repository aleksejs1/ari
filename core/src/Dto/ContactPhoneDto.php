<?php

namespace App\Dto;

class ContactPhoneDto
{
    public function __construct(
        public readonly string $value = '',
        public readonly string $type = '',
    ) {
    }
}
