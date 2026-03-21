<?php

declare(strict_types=1);

namespace Ari\Exception;

/**
 * Thrown when a state transition is not allowed by the domain rules.
 * Mapped to HTTP 422 Unprocessable Entity via api_platform.yaml exception_to_status.
 */
final class InvalidStateTransitionException extends \RuntimeException
{
}
