<?php

namespace Plugins\GiftPlugin;

use Symfony\Component\HttpKernel\Bundle\Bundle;

class GiftPlugin extends Bundle
{
    public function getPath(): string
    {
        return \dirname(__DIR__);
    }
}
