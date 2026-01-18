<?php

namespace App\Service;

use App\Entity\Contact;
use App\Entity\ContactAvatar;
use Intervention\Image\Drivers\Gd\Driver;
use Intervention\Image\ImageManager;
use League\Flysystem\FilesystemOperator;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\HttpFoundation\File\UploadedFile;

class AvatarManager
{
    private FilesystemOperator $storage;
    private ImageManager $imageManager;

    public function __construct(
        #[Autowire(service: 'avatar.storage.local')]
        private FilesystemOperator $localStorage,
        #[Autowire(service: 'avatar.storage.s3')]
        private FilesystemOperator $s3Storage,
        #[Autowire(env: 'STORAGE_TYPE')]
        private string $storageType,
        #[Autowire(env: 'bool:APP_STORE_THUMBNAILS_IN_DB')]
        private bool $storeThumbnailsInDb,
    ) {
        $this->imageManager = new ImageManager(new Driver());
        $this->storage = 's3' === $this->storageType ? $this->s3Storage : $this->localStorage;
    }

    public function upload(Contact $contact, UploadedFile $file): ContactAvatar
    {
        $extension = $file->guessExtension() ?? 'bin';
        $filename = sprintf('%s.%s', bin2hex(random_bytes(16)), $extension);

        // 2. Read file content
        $realPath = $file->getRealPath();
        if (!$realPath) {
            throw new \RuntimeException('Invalid file path');
        }
        $stream = fopen($realPath, 'r+');
        if (!is_resource($stream)) {
            throw new \RuntimeException('Could not open file stream');
        }

        // 3. Save original to storage
        $this->storage->writeStream($filename, $stream);
        fclose($stream);

        // 4. Handle old avatar if exists
        $oldAvatar = $contact->getAvatar();
        if (null !== $oldAvatar) {
            $oldPath = $oldAvatar->getPath();
            if (null !== $oldPath) {
                try {
                    $this->storage->delete($oldPath);
                } catch (\Exception $e) {
                    // Ignore if file already gone
                }
            }
        } else {
            $oldAvatar = new ContactAvatar();
            $oldAvatar->setContact($contact);
            $user = $contact->getTenant();
            if (null !== $user) {
                $oldAvatar->setTenant($user);
            }
        }

        // 5. Update Avatar Entity
        $oldAvatar->setPath($filename);
        $oldAvatar->setMimeType($file->getClientMimeType());
        $oldAvatar->setSize($file->getSize());

        // 6. Create Thumbnail if enabled
        if ($this->storeThumbnailsInDb) {
            $realPath = $file->getRealPath();
            if (false !== $realPath) {
                $image = $this->imageManager->read($realPath);
                $image->scaleDown(width: 150, height: 150);
                $oldAvatar->setThumbnailData($image->encode()->toString());
            }
        }

        return $oldAvatar;
    }
}
