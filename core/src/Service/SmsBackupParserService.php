<?php

namespace Ari\Service;

use Ari\Exception\SmsBackupParseException;
use Ari\ValueObject\ParsedRecord;
use Symfony\Component\DependencyInjection\Attribute\Autowire;

class SmsBackupParserService
{
    private const MAX_HEADER_BYTES = 512;

    /** Encodings that are already UTF-8 compatible and need no transcoding. */
    private const UTF8_ENCODINGS = ['UTF-8', 'UTF8', 'ASCII', 'US-ASCII'];

    /**
     * Allowed non-UTF-8 source encodings for transcoding.
     * All values must be uppercase (compared via strtoupper).
     */
    private const ALLOWED_SOURCE_ENCODINGS = [
        'UTF-16', 'UTF-16LE', 'UTF-16BE',
        'ISO-8859-1', 'LATIN1',
        'ISO-8859-2', 'LATIN2',
        'ISO-8859-15',
        'WINDOWS-1250', 'CP1250',
        'WINDOWS-1251', 'CP1251',
        'WINDOWS-1252', 'CP1252',
        'KOI8-R', 'KOI8-U',
    ];

    /** Maximum size of the file after transcoding to UTF-8. */
    private const MAX_TRANSCODED_SIZE_BYTES = 15 * 1024 * 1024;

    public function __construct(
        #[Autowire('%kernel.project_dir%/var/sms_import_tmp')]
        private readonly string $tempDir,
    ) {
    }

    /**
     * Parse an SMS Backup & Restore XML file (sms-*.xml or calls-*.xml).
     *
     * @return list<ParsedRecord>
     *
     * @throws SmsBackupParseException on malformed XML, unrecognised root element, or encoding errors
     */
    public function parse(string $filePath): array
    {
        $this->validateFilePath($filePath);

        $tempFile = null;
        $parseTarget = $filePath;

        $encoding = $this->detectEncoding($filePath);
        if (null !== $encoding && !in_array(strtoupper($encoding), self::UTF8_ENCODINGS, true)) {
            $parseTarget = $this->transcodeToUtf8($filePath, $encoding);
            $tempFile = $parseTarget;
        }

        try {
            return $this->parseFile($parseTarget);
        } finally {
            if (null !== $tempFile && file_exists($tempFile)) {
                unlink($tempFile);
            }
        }
    }

    /**
     * @return list<ParsedRecord>
     *
     * @throws SmsBackupParseException
     */
    private function parseFile(string $filePath): array
    {
        $prevLibxmlState = libxml_use_internal_errors(true);
        libxml_clear_errors();

        try {
            // LIBXML_NONET blocks network access (http:// external entities).
            // SUBST_ENTITIES=false prevents local file:// XXE by disabling entity substitution entirely.
            $reader = \XMLReader::open($filePath, null, LIBXML_NONET);
            if (!$reader instanceof \XMLReader) {
                throw new SmsBackupParseException('Failed to open XML file for parsing.');
            }
            $reader->setParserProperty(\XMLReader::SUBST_ENTITIES, false);

            // Skip to root element
            while ($reader->read() && \XMLReader::ELEMENT !== $reader->nodeType) {
            }

            $rootName = $reader->localName;
            if ('smses' !== $rootName && 'calls' !== $rootName) {
                $reader->close();
                throw new SmsBackupParseException(
                    sprintf('Invalid XML: root element must be <smses> or <calls>, got <%s>.', $rootName)
                );
            }

            $isSms = 'smses' === $rootName;
            $records = [];

            while ($reader->read()) {
                if (\XMLReader::ELEMENT !== $reader->nodeType) {
                    continue;
                }

                $elementName = $reader->localName;

                if ($isSms && 'sms' === $elementName) {
                    $record = $this->parseSmsElement($reader);
                    if (null !== $record) {
                        $records[] = $record;
                    }
                } elseif (!$isSms && 'call' === $elementName) {
                    $record = $this->parseCallElement($reader);
                    if (null !== $record) {
                        $records[] = $record;
                    }
                }
            }

            $reader->close();

            $errors = libxml_get_errors();
            libxml_clear_errors();

            if ([] !== $errors) {
                $first = $errors[0];
                throw new SmsBackupParseException(
                    sprintf('XML parse error at line %d: %s', $first->line, trim($first->message))
                );
            }

            return $records;
        } finally {
            libxml_use_internal_errors($prevLibxmlState);
        }
    }

    private function parseSmsElement(\XMLReader $reader): ?ParsedRecord
    {
        $address = $reader->getAttribute('address') ?? '';
        $typeAttr = $reader->getAttribute('type') ?? '1';
        $dateAttr = $reader->getAttribute('date') ?? '0';
        $contactName = $reader->getAttribute('contact_name') ?? '';

        if ('' === $address) {
            return null;
        }

        $normalizedPhone = preg_replace('/\D/', '', $address) ?? '';

        $timestampMs = (int) $dateAttr;
        $timestamp = (int) ($timestampMs / 1000);

        try {
            $date = new \DateTimeImmutable('@' . $timestamp);
        } catch (\Exception) {
            return null;
        }

        // SMS type: 1 = received (incoming), 2 = sent (outgoing)
        $direction = 2 === (int) $typeAttr ? 'outgoing' : 'incoming';

        return new ParsedRecord(
            type: ParsedRecord::TYPE_SMS,
            phoneNumber: $address,
            normalizedPhone: $normalizedPhone,
            contactName: $contactName,
            date: $date,
            direction: $direction,
        );
    }

    private function parseCallElement(\XMLReader $reader): ?ParsedRecord
    {
        $number = $reader->getAttribute('number') ?? '';
        $typeAttr = $reader->getAttribute('type') ?? '1';
        $dateAttr = $reader->getAttribute('date') ?? '0';
        $contactName = $reader->getAttribute('contact_name') ?? '';
        $durationAttr = $reader->getAttribute('duration') ?? '0';

        if ('' === $number) {
            return null;
        }

        $normalizedPhone = preg_replace('/\D/', '', $number) ?? '';

        $timestampMs = (int) $dateAttr;
        $timestamp = (int) ($timestampMs / 1000);

        try {
            $date = new \DateTimeImmutable('@' . $timestamp);
        } catch (\Exception) {
            return null;
        }

        // Call type: 1=incoming answered, 2=outgoing, 3=missed, 5=rejected
        $direction = match ((int) $typeAttr) {
            1 => 'incoming',
            2 => 'outgoing',
            3 => 'missed',
            5 => 'rejected',
            default => 'incoming',
        };

        $durationSeconds = (int) $durationAttr;

        return new ParsedRecord(
            type: ParsedRecord::TYPE_CALL,
            phoneNumber: $number,
            normalizedPhone: $normalizedPhone,
            contactName: $contactName,
            date: $date,
            direction: $direction,
            durationSeconds: $durationSeconds > 0 ? $durationSeconds : null,
        );
    }

    /**
     * Detect the XML encoding from the declaration header.
     * Returns the encoding string, or null if not declared.
     */
    private function detectEncoding(string $filePath): ?string
    {
        $handle = fopen($filePath, 'r');
        if (false === $handle) {
            return null;
        }

        $header = fread($handle, self::MAX_HEADER_BYTES);
        fclose($handle);

        if (false === $header) {
            return null;
        }

        if (1 === preg_match('/<\?xml[^>]+encoding=["\']([^"\']+)["\']/', $header, $matches)) {
            return $matches[1];
        }

        return null;
    }

    /**
     * Read the file, transcode from $fromEncoding to UTF-8, write to a temp file.
     * Returns the path to the temp file. Caller is responsible for unlinking it.
     *
     * @throws SmsBackupParseException
     */
    private function transcodeToUtf8(string $filePath, string $fromEncoding): string
    {
        if (!in_array(strtoupper($fromEncoding), self::ALLOWED_SOURCE_ENCODINGS, true)) {
            throw new SmsBackupParseException(
                sprintf('Unsupported source encoding "%s".', $fromEncoding)
            );
        }

        $content = file_get_contents($filePath);
        if (false === $content) {
            throw new SmsBackupParseException('Failed to read file for encoding transcoding.');
        }

        $utf8 = mb_convert_encoding($content, 'UTF-8', $fromEncoding);
        if (false === $utf8) {
            throw new SmsBackupParseException(
                sprintf('Failed to transcode file from %s to UTF-8.', $fromEncoding)
            );
        }

        if (strlen($utf8) > self::MAX_TRANSCODED_SIZE_BYTES) {
            throw new SmsBackupParseException(
                sprintf('Transcoded file exceeds the %d MB size limit.', self::MAX_TRANSCODED_SIZE_BYTES / 1024 / 1024)
            );
        }

        // Update the encoding declaration so XMLReader does not reject it
        $utf8 = (string) preg_replace('/encoding=["\'][^"\']+["\']/', 'encoding="UTF-8"', $utf8, 1);

        if (!is_dir($this->tempDir) && !mkdir($this->tempDir, 0700, true) && !is_dir($this->tempDir)) {
            throw new SmsBackupParseException('Failed to create temporary directory for encoding transcoding.');
        }

        $tempFile = tempnam($this->tempDir, 'ari_sms_import_');
        if (false === $tempFile) {
            throw new SmsBackupParseException('Failed to create temporary file for encoding transcoding.');
        }

        $written = file_put_contents($tempFile, $utf8);
        if (false === $written) {
            unlink($tempFile);
            throw new SmsBackupParseException('Failed to write transcoded content to temporary file.');
        }

        return $tempFile;
    }

    /**
     * Ensure the file path resolves to within an allowed directory.
     * Prevents path traversal if file paths are ever derived from user-controlled input.
     *
     * @throws SmsBackupParseException
     */
    private function validateFilePath(string $filePath): void
    {
        $realPath = realpath($filePath);
        if (false === $realPath) {
            throw new SmsBackupParseException('File does not exist or path cannot be resolved.');
        }

        $allowedDirs = array_filter(
            array_map('realpath', [sys_get_temp_dir(), $this->tempDir]),
            static fn (string|false $dir): bool => false !== $dir,
        );

        foreach ($allowedDirs as $dir) {
            if (str_starts_with($realPath, $dir . DIRECTORY_SEPARATOR)) {
                return;
            }
        }

        throw new SmsBackupParseException('File path is not within an allowed directory.');
    }
}
