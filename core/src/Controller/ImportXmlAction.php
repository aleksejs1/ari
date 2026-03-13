<?php

namespace Ari\Controller;

use Ari\Service\ContactImport\XmlImportService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

#[AsController]
class ImportXmlAction extends AbstractController
{
    public function __construct(
        private readonly XmlImportService $importService,
        private readonly Security $security,
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
        } catch (\Exception $e) {
            throw new BadRequestHttpException('Import failed: ' . $e->getMessage(), $e);
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
