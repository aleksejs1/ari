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
        #[Autowire('%storage_type%')]
        private string $storageType,
        #[Autowire('%app_store_thumbnails_in_db%')]
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

    public function uploadContent(Contact $contact, string $content, string $mimeType): ContactAvatar
    {
        $extension = 'bin';
        if (str_contains($mimeType, 'jpeg') || str_contains($mimeType, 'jpg')) {
            $extension = 'jpg';
        } elseif (str_contains($mimeType, 'png')) {
            $extension = 'png';
        } elseif (str_contains($mimeType, 'webp')) {
            $extension = 'webp';
        }

        $filename = sprintf('%s.%s', bin2hex(random_bytes(16)), $extension);

        // Save to storage
        $this->storage->write($filename, $content);

        // Handle old avatar
        $oldAvatar = $contact->getAvatar();
        if (null !== $oldAvatar) {
            $oldPath = $oldAvatar->getPath();
            if (null !== $oldPath) {
                try {
                    $this->storage->delete($oldPath);
                } catch (\Exception $e) {
                    // Ignore
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

        $oldAvatar->setPath($filename);
        $oldAvatar->setMimeType($mimeType);
        $oldAvatar->setSize(strlen($content));

        if ($this->storeThumbnailsInDb) {
            try {
                $image = $this->imageManager->read($content);
                $image->scaleDown(width: 150, height: 150);
                $oldAvatar->setThumbnailData($image->encode()->toString());
            } catch (\Exception $e) {
                // If simple resizing fails (e.g. invalid image), use original as fallback or log
                $oldAvatar->setThumbnailData($content);
            }
        }

        return $oldAvatar;
    }
}
