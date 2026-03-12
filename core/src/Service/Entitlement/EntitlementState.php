<?php

namespace Ari\Service\Entitlement;

enum EntitlementState: string
{
    case Allowed = 'allowed';
    case Denied  = 'denied';
    case Promo   = 'promo';
}
