<?php

namespace App\Controller;

use App\Service\ContactImport\XmlImportService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\Routing\Annotation\Route;

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
        if (!$user instanceof \App\Entity\User) {
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
            $this->importService->import($xmlContent, $user);
        } catch (\Exception $e) {
            throw new BadRequestHttpException('Import failed: ' . $e->getMessage(), $e);
        }

        return new Response(null, 204);
    }
}
