<?php

namespace App\Dto;

class ContactDateDto
{
    public function __construct(
        public readonly \DateTimeInterface $date,
        public readonly ?string $text = null,
    ) {
    }
}
