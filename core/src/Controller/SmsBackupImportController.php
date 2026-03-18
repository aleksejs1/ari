<?php

namespace Ari\Controller;

use Ari\Entity\Contact;
use Ari\Entity\User;
use Ari\Exception\SmsBackupParseException;
use Ari\Security\Voter\ContactVoter;
use Ari\Service\SmsBackupSubmitService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[IsGranted('ROLE_USER')]
#[Route('/api/sms_backup/import', name: 'api_sms_backup_import', methods: ['POST'])]
class SmsBackupImportController extends AbstractController
{
    private const ALLOWED_UNKNOWN_NUMBERS = ['skip', 'create'];
    private const ALLOWED_NAME_CONFLICT = ['keep', 'add', 'replace'];
    private const ALLOWED_DUPLICATE_STRATEGY = ['skip', 'create'];

    public function __construct(
        private readonly SmsBackupSubmitService $submitService,
    ) {
    }

    public function __invoke(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();

        // ContactVoter::ADD checks only the authenticated user's contact quota, not tenant
        // ownership of the subject. Passing an unowned Contact() is intentional and safe:
        // the ADD case never inspects the subject's tenant field.
        $this->denyAccessUnlessGranted(ContactVoter::ADD, new Contact());

        // Validate options (cast to string so static analysis knows these are strings).
        $unknownNumbers = (string) ($request->request->get('unknownNumbers') ?? 'skip');
        $nameConflict = (string) ($request->request->get('nameConflict') ?? 'keep');
        $skipAlphanumericRaw = (string) ($request->request->get('skipAlphanumeric') ?? 'true');
        $duplicateStrategy = (string) ($request->request->get('duplicateStrategy') ?? 'skip');

        if (!in_array($unknownNumbers, self::ALLOWED_UNKNOWN_NUMBERS, true)) {
            return $this->json(['detail' => sprintf('Invalid unknownNumbers value: "%s".', $unknownNumbers)], Response::HTTP_UNPROCESSABLE_ENTITY);
        }
        if (!in_array($nameConflict, self::ALLOWED_NAME_CONFLICT, true)) {
            return $this->json(['detail' => sprintf('Invalid nameConflict value: "%s".', $nameConflict)], Response::HTTP_UNPROCESSABLE_ENTITY);
        }
        if (!in_array($duplicateStrategy, self::ALLOWED_DUPLICATE_STRATEGY, true)) {
            return $this->json(['detail' => sprintf('Invalid duplicateStrategy value: "%s".', $duplicateStrategy)], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        // Collect uploaded files.
        /** @var \Symfony\Component\HttpFoundation\File\UploadedFile[]|null $uploadedFiles */
        $uploadedFiles = $request->files->get('files');

        if (null === $uploadedFiles || [] === $uploadedFiles) {
            return $this->json(['detail' => 'At least one XML file is required.'], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        if (!is_array($uploadedFiles)) {
            $uploadedFiles = [$uploadedFiles];
        }

        try {
            $this->submitService->submit(
                files: $uploadedFiles,
                user: $user,
                unknownNumbers: $unknownNumbers,
                nameConflict: $nameConflict,
                skipAlphanumeric: 'false' !== $skipAlphanumericRaw,
                duplicateStrategy: $duplicateStrategy,
            );
        } catch (\InvalidArgumentException $e) {
            return $this->json(['detail' => $e->getMessage()], Response::HTTP_UNPROCESSABLE_ENTITY);
        } catch (SmsBackupParseException $e) {
            return $this->json(['detail' => $e->getMessage()], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        return $this->json(
            ['status' => 'queued', 'message' => 'Import queued. You will receive a notification when complete.'],
            Response::HTTP_ACCEPTED
        );
    }
}
