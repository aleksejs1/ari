<?php

declare(strict_types=1);

namespace Ari\Service;

final class PlaybookTemplateRegistry
{
    /** @var array<string, PlaybookTemplateConfig> */
    private array $templates;

    /**
     * @param list<PlaybookTemplateConfig> $configs
     */
    public function __construct(array $configs)
    {
        $this->templates = [];
        foreach ($configs as $config) {
            $this->templates[$config->preset] = $config;
        }
    }

    public static function fromFile(string $path): self
    {
        /** @var list<PlaybookTemplateConfig> $configs */
        $configs = require $path;

        return new self($configs);
    }

    /** @return list<PlaybookTemplateConfig> */
    public function findAll(): array
    {
        return array_values($this->templates);
    }

    public function findByPreset(string $preset): PlaybookTemplateConfig
    {
        if (!isset($this->templates[$preset])) {
            throw new \InvalidArgumentException(sprintf('Unknown preset: %s', $preset));
        }

        return $this->templates[$preset];
    }
}
