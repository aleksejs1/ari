<?php

namespace Ari\Tests\Unit\Service;

use Ari\Repository\AiSuggestionRepository;
use Ari\Service\Ai\AiSuggestionService;
use Ari\Service\Ai\LlmClientInterface;
use Ari\Service\Ai\NullLlmClient;
use PHPUnit\Framework\TestCase;
use Symfony\Component\Messenger\MessageBusInterface;

class AiSuggestionServiceTest extends TestCase
{
    private AiSuggestionService $service;

    #[\Override]
    protected function setUp(): void
    {
        $this->service = new AiSuggestionService(
            self::createStub(LlmClientInterface::class),
            self::createStub(AiSuggestionRepository::class),
            self::createStub(MessageBusInterface::class),
        );
    }

    // ── isEligibleForSuggestion ────────────────────────────────────────────

    public function testEligibleForSuggestionReturnsTrueForCyrillicName(): void
    {
        self::assertTrue($this->service->isEligibleForSuggestion('Янис', 'Берзиньш', null));
    }

    public function testEligibleForSuggestionReturnsTrueForLatinName(): void
    {
        self::assertTrue($this->service->isEligibleForSuggestion('Janis', 'Berzins', null));
    }

    public function testNotEligibleWhenLocaleAlreadySet(): void
    {
        // Locale set → skip (prevents infinite loop after acceptance)
        self::assertFalse($this->service->isEligibleForSuggestion('Янис', 'Берзиньш', 'ru'));
        self::assertFalse($this->service->isEligibleForSuggestion('Janis', 'Berzins', 'lv'));
        self::assertFalse($this->service->isEligibleForSuggestion(null, null, 'en'));
    }

    public function testNotEligibleWhenNameTooShort(): void
    {
        self::assertFalse($this->service->isEligibleForSuggestion('Ян', null, null));
        self::assertFalse($this->service->isEligibleForSuggestion(null, null, null));
        self::assertFalse($this->service->isEligibleForSuggestion('', '', null));
        self::assertFalse($this->service->isEligibleForSuggestion('AB', null, null));
    }

    public function testNotEligibleWhenNameContainsDigits(): void
    {
        self::assertFalse($this->service->isEligibleForSuggestion('John123', 'Doe', null));
        self::assertFalse($this->service->isEligibleForSuggestion('1stName', null, null));
    }

    public function testNotEligibleWhenNameContainsSpecialChars(): void
    {
        self::assertFalse($this->service->isEligibleForSuggestion('John@', 'Doe', null));
        self::assertFalse($this->service->isEligibleForSuggestion('John', 'Doe!', null));
    }

    public function testNotEligibleWhenNameContainsBothScripts(): void
    {
        // Mixed Cyrillic + Latin → unpredictable AI result
        self::assertFalse($this->service->isEligibleForSuggestion('JanисБерзиньш', null, null));
        self::assertFalse($this->service->isEligibleForSuggestion('Янис', 'Berzins', null));
    }

    public function testEligibleWithHyphenAndApostrophe(): void
    {
        // Hyphens and apostrophes are common in names
        self::assertTrue($this->service->isEligibleForSuggestion("O'Brien", null, null));
        self::assertTrue($this->service->isEligibleForSuggestion('Marie-Claire', null, null));
    }

    // ── computeSourceHash ─────────────────────────────────────────────────

    public function testComputeSourceHashIsDeterministic(): void
    {
        $hash1 = $this->service->computeSourceHash('John', 'Doe');
        $hash2 = $this->service->computeSourceHash('John', 'Doe');
        self::assertSame($hash1, $hash2);
    }

    public function testComputeSourceHashIsCaseInsensitive(): void
    {
        $hash1 = $this->service->computeSourceHash('john', 'doe');
        $hash2 = $this->service->computeSourceHash('JOHN', 'DOE');
        $hash3 = $this->service->computeSourceHash('John', 'Doe');
        self::assertSame($hash1, $hash2);
        self::assertSame($hash2, $hash3);
    }

    public function testComputeSourceHashIsTrimInsensitive(): void
    {
        $hash1 = $this->service->computeSourceHash('John', 'Doe');
        $hash2 = $this->service->computeSourceHash('  John  ', '  Doe  ');
        self::assertSame($hash1, $hash2);
    }

    public function testComputeSourceHashDiffersForDifferentNames(): void
    {
        $hash1 = $this->service->computeSourceHash('John', 'Doe');
        $hash2 = $this->service->computeSourceHash('Jane', 'Doe');
        self::assertNotSame($hash1, $hash2);
    }

    public function testComputeSourceHashHandlesNullValues(): void
    {
        // Should not throw; nulls treated as empty strings
        $hash = $this->service->computeSourceHash(null, null);
        self::assertNotEmpty($hash);
        self::assertSame(32, \strlen($hash)); // MD5 length
    }

    // ── isValidLocale ────────────────────────────────────────────────────

    public function testIsValidLocaleAcceptsKnownCodes(): void
    {
        self::assertTrue($this->service->isValidLocale('ru'));
        self::assertTrue($this->service->isValidLocale('lv'));
        self::assertTrue($this->service->isValidLocale('en'));
        self::assertTrue($this->service->isValidLocale('de'));
    }

    public function testIsValidLocaleRejectsGarbage(): void
    {
        self::assertFalse($this->service->isValidLocale('Russian'));
        self::assertFalse($this->service->isValidLocale('ru-RU'));
        self::assertFalse($this->service->isValidLocale('rus'));
        self::assertFalse($this->service->isValidLocale(''));
        self::assertFalse($this->service->isValidLocale(null));
        self::assertFalse($this->service->isValidLocale('zh')); // Not in allowed list
        self::assertFalse($this->service->isValidLocale('ar'));
    }

    // ── NullLlmClient ─────────────────────────────────────────────────────

    public function testNullLlmClientIsNotAvailable(): void
    {
        $nullClient = new NullLlmClient();
        self::assertFalse($nullClient->isAvailable());
    }

    public function testNullLlmClientSuggestReturnsNull(): void
    {
        $nullClient = new NullLlmClient();
        $result = $nullClient->suggestLocaleAlternative('John', 'Doe', ['en', 'ru']);
        self::assertNull($result);
    }

    public function testMaybeDispatchSkipsWhenLlmUnavailable(): void
    {
        $llmClient = self::createStub(LlmClientInterface::class);
        $llmClient->method('isAvailable')->willReturn(false);

        $messageBus = $this->createMock(MessageBusInterface::class);
        $messageBus->expects(self::never())->method('dispatch');

        $service = new AiSuggestionService(
            $llmClient,
            self::createStub(AiSuggestionRepository::class),
            $messageBus,
        );

        $contact = new \Ari\Entity\Contact();
        $user = new \Ari\Entity\User();
        $user->setUuid('test');
        $contact->setUser($user);
        $contactName = new \Ari\Entity\ContactName($contact);
        $contactName->setGiven('Janis');
        $contactName->setFamily('Berzins');

        $service->maybeDispatch($contactName);
        // No dispatch expected (assertion above)
    }
}
