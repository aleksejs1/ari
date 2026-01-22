import type { KnipConfig } from 'knip'

const config: KnipConfig = {
  entry: ['src/main.tsx'],
  project: ['src/**/*.{ts,tsx}'],
  ignore: [
    'src/types/schema.d.ts',
    'src/components/ui/dialog.tsx',
    'src/components/ui/sheet.tsx',
    'src/components/ui/dropdown-menu.tsx',
    'src/components/ui/popover.tsx',
  ],
  ignoreBinaries: ['dot'],
  ignoreExportsUsedInFile: true,
  ignoreDependencies: ['babel-plugin-react-compiler'],
}

export default config
