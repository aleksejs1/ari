import type { KnipConfig } from 'knip'

const config: KnipConfig = {
  entry: ['src/main.tsx', 'src/plugins/*/index.tsx', 'src/env.d.ts', 'src/shared-ui.ts'],
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
    // Entitlement infrastructure — consumed by Phase 4 UI wiring
    'src/lib/entitlements/**',
  ],
  ignoreBinaries: ['dot'],
  ignoreExportsUsedInFile: true,
  ignoreDependencies: [],
}

export default config
