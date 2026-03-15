<?php

namespace Ari\Controller;

use Ari\Service\ContactImport\XmlImportService;
use Psr\Log\LoggerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\HttpKernel\Exception\ServiceUnavailableHttpException;

#[AsController]
class ImportXmlAction extends AbstractController
{
    public function __construct(
        private readonly XmlImportService $importService,
        private readonly Security $security,
        private readonly LoggerInterface $logger,
    ) {
    }

    public function __invoke(Request $request): Response
    {
        $user = $this->security->getUser();
        if (!$user instanceof \Ari\Entity\User) {
            throw $this->createAccessDeniedException();
        }

        $file = $request->files->get('file'); // Expecting 'file' key in multipart
        if (null === $file) {
            // Fallback: check raw body if it looks like XML
            $content = $request->getContent();
            if ('' !== $content && str_starts_with(trim($content), '<')) {
                $xmlContent = $content;
            } else {
                throw new BadRequestHttpException('No file or XML content provided');
            }
        } else {
            $xmlContent = file_get_contents($file->getPathname());
        }

        if (false === $xmlContent || '' === $xmlContent) {
            throw new BadRequestHttpException('Empty content');
        }

        try {
            $result = $this->importService->import($xmlContent, $user);
        } catch (\InvalidArgumentException $e) {
            // Invalid XML format or structure — client error
            throw new BadRequestHttpException($e->getMessage(), $e);
        } catch (\Doctrine\DBAL\Exception $e) {
            // Database-level error — not the client's fault
            $this->logger->error('XML import failed due to database error', [
                'exception' => $e,
                'user' => $user->getUserIdentifier(),
            ]);
            throw new ServiceUnavailableHttpException(null, 'Import failed due to a temporary database error.', $e);
        } catch (\Throwable $e) {
            // Unexpected error — log full details, return a generic message (do not leak internals)
            $this->logger->error('XML import failed unexpectedly', [
                'exception' => $e,
                'user' => $user->getUserIdentifier(),
            ]);
            throw new BadRequestHttpException('Import failed. Please check your file and try again.', $e);
        }

        // Quota fully exhausted — no new contacts could be added
        if (0 === $result->imported && $result->skipped > 0 && 'quota_exceeded' === $result->reason) {
            return new JsonResponse(
                ['error' => 'quota_exceeded', 'remaining' => 0],
                Response::HTTP_UNPROCESSABLE_ENTITY,
            );
        }

        // Partial import — some new contacts were skipped due to quota
        if ($result->skipped > 0) {
            return new JsonResponse(
                [
                    'imported' => $result->imported,
                    'skipped' => $result->skipped,
                    'reason' => $result->reason,
                    'skippedContacts' => $result->skippedContacts,
                ],
                Response::HTTP_MULTI_STATUS,
            );
        }

        return new Response(null, Response::HTTP_NO_CONTENT);
    }
}
