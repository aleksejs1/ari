import type { KnipConfig } from 'knip'

const config: KnipConfig = {
  entry: ['src/main.tsx', 'src/plugins/*/index.tsx', 'src/env.d.ts', 'src/shared-ui.ts'],
  project: ['src/**/*.{ts,tsx}'],
  vitest: {
    entry: ['src/**/*.test.{ts,tsx}', 'src/test/setup.tsx'],
  },
  ignore: [
    'src/types/schema.d.ts',
    'src/tanstack-table.d.ts',
    'src/components/ui/sheet.tsx',
    'src/components/ui/dropdown-menu.tsx',
    'src/components/ui/popover.tsx',
    // Infrastructure files — no static consumers; used by remote plugins at runtime
    'src/lib/QueryKeyRegistry.ts',
    'src/lib/events/PluginEventBus.ts',
  ],
  ignoreBinaries: ['dot'],
  ignoreExportsUsedInFile: true,
  ignoreDependencies: [],
}

export default config
