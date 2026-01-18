<?php

namespace App\Service\Helper;

use Doctrine\Common\Collections\Collection;

trait CollectionSyncTrait
{
    /**
     * @template T of object
     * @template D
     *
     * @param Collection<int, T>   $collection
     * @param array<D>             $dtos
     * @param callable(T, D): bool $isEqual
     * @param callable(T, D): void $update
     * @param callable(D): T       $create
     */
    protected function syncCollection(
        Collection $collection,
        array $dtos,
        callable $isEqual,
        callable $update,
        callable $create,
        bool $deleteMissing = true,
    ): void {
        $existingItems = $collection->toArray();
        $unmatchedDtos = [];

        // 1. Find exact matches
        foreach ($dtos as $dto) {
            $found = false;
            foreach ($existingItems as $key => $entity) {
                if ($isEqual($entity, $dto)) {
                    $found = true;
                    unset($existingItems[$key]); // Remove from pool so it's not matched again
                    break;
                }
            }
            if (!$found) {
                $unmatchedDtos[] = $dto;
            }
        }

        // $existingItems now contains items to be removed OR recycled
        // $unmatchedDtos contains items to be added OR recycled into existingItems

        // 2. Recycle/Update matching one-by-one
        // We re-index existing keys to iterate easily
        $existingItems = array_values($existingItems);

        foreach ($unmatchedDtos as $dto) {
            if ([] !== $existingItems) {
                // Recycle an existing entity
                $entity = array_shift($existingItems);
                $update($entity, $dto);
                // We don't need to add it to collection as it is already there
            } else {
                // Create new
                $newEntity = $create($dto);
                $collection->add($newEntity);
            }
        }

        // 3. Remove remaining
        if ($deleteMissing) {
            foreach ($existingItems as $entityToRemove) {
                $collection->removeElement($entityToRemove);
            }
        }
    }
}
