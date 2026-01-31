<?php

namespace Ari\Controller;

use Ari\Service\Export\ContactExportService;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;

#[AsController]
class ExportContactsAction
{
    public function __invoke(
        Request $request,
        ContactExportService $exportService,
        Security $security,
    ): StreamedResponse {
        $user = $security->getUser();

        if (!$user instanceof \Ari\Entity\User) {
            throw new AccessDeniedException();
        }

        return new StreamedResponse(function () use ($user, $exportService) {
            $exportService->exportToXml($user, function (string $chunk) {
                echo $chunk;
                flush();
            });
        }, 200, [
            'Content-Type' => 'text/xml',
            'Content-Disposition' => 'attachment; filename="contacts_export.xml"',
        ]);
    }
}
