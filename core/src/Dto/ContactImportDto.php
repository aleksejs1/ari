<?php

namespace App\Dto;

class ContactImportDto
{
    /**
     * @param ContactNameDto[] $names
     * @param ContactDateDto[] $dates
     */
    public function __construct(
        public readonly array $names = [],
        public readonly array $dates = [],
    ) {
    }
}
