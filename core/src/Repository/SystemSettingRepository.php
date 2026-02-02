<?php

namespace Ari\Repository;

use Ari\Entity\SystemSetting;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<SystemSetting>
 */
class SystemSettingRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, SystemSetting::class);
    }

    public function getValue(string $id): ?string
    {
        $setting = $this->find($id);

        return $setting?->getValue();
    }

    public function setValue(string $id, string $value): void
    {
        $setting = $this->find($id);

        if ($setting !== null) {
            $setting->setValue($value);
        } else {
            $setting = new SystemSetting($id, $value);
            $this->getEntityManager()->persist($setting);
        }

        $this->getEntityManager()->flush();
    }
}
