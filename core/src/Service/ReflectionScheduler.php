<?php

declare(strict_types=1);

namespace Ari\Service;

use Symfony\Component\HttpFoundation\RequestStack;

/**
 * Computes the reflection due date for offline tasks.
 * "Next day at 09:00" in the user's timezone (from X-Timezone header).
 */
final class ReflectionScheduler
{
    public function __construct(private readonly RequestStack $requestStack)
    {
    }

    /**
     * Returns "tomorrow at 09:00" in the user's timezone, converted to UTC.
     * Falls back to UTC if no valid X-Timezone header is present.
     */
    public function computeDueAt(): \DateTimeImmutable
    {
        $tzName = 'UTC';
        $request = $this->requestStack->getCurrentRequest();

        if (null !== $request) {
            $headerTz = $request->headers->get('X-Timezone');
            if (null !== $headerTz && '' !== $headerTz && \strlen($headerTz) <= 64 && \in_array($headerTz, \DateTimeZone::listIdentifiers(), true)) {
                $tzName = $headerTz;
            }
        }

        $tz = new \DateTimeZone($tzName);

        return (new \DateTimeImmutable('tomorrow 09:00:00', $tz))->setTimezone(new \DateTimeZone('UTC'));
    }
}
