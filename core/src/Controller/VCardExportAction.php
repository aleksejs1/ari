<?php

namespace App\Controller;

use App\Entity\Contact;
use App\Service\VCard\VCardService;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\AsController;

#[AsController]
class VCardExportAction
{
    public function __invoke(
        Contact $data,
        VCardService $vCardService,
    ): Response {
        $vCardContent = $vCardService->generateVCard($data);

        // Sanitize filename
        $filename = $data->getDisplayName();
        $filename = preg_replace('/[^a-zA-Z0-9_\-]/u', '_', $filename);
        $filename = (null !== $filename && '' !== $filename) ? $filename : 'contact';

        return new Response($vCardContent, 200, [
            'Content-Type' => 'text/vcard; charset=utf-8',
            'Content-Disposition' => 'attachment; filename="' . $filename . '.vcf"',
        ]);
    }
}
