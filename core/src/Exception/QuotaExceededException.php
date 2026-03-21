<?php

declare(strict_types=1);

namespace Ari\Exception;

/**
 * Thrown when a user attempts to create an entity that would exceed their plan quota.
 * Mapped to HTTP 422 via api_platform.yaml exception_to_status.
 */
final class QuotaExceededException extends \RuntimeException
{
}
