import type { KnipConfig } from 'knip'

const config: KnipConfig = {
  entry: ['src/main.tsx', 'src/plugins/*/index.tsx', 'src/env.d.ts'],
  project: ['src/**/*.{ts,tsx}'],
  vitest: {
    entry: ['src/**/*.test.{ts,tsx}', 'src/test/setup.tsx'],
  },
  ignore: [
    'src/types/schema.d.ts',
    'src/components/ui/dialog.tsx',
    'src/components/ui/sheet.tsx',
    'src/components/ui/dropdown-menu.tsx',
    'src/components/ui/popover.tsx',
  ],
  ignoreBinaries: [
    'dot',
    'vite',
    'eslint',
    'stylelint',
    'depcruise',
    'knip',
    'prettier',
    'openapi-typescript',
    'husky',
    'lint-staged',
    'vitest',
    'tsc',
  ],
  ignoreExportsUsedInFile: true,
  ignoreDependencies: [
    '@eslint/js',
    'typescript-eslint',
    '@testing-library/dom',
    'husky',
    'lint-staged',
    'prettier',
    'stylelint',
    'openapi-typescript',
    '@ari/eslint-config',
  ],
}

export default config
