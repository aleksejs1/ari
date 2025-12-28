import type { KnipConfig } from 'knip'

const config: KnipConfig = {
  entry: ['src/main.tsx'],
  project: ['src/**/*.{ts,tsx}'],
  ignore: ['src/types/schema.d.ts'],
  ignoreBinaries: ['dot'],
  ignoreExportsUsedInFile: true,
  ignoreDependencies: ['babel-plugin-react-compiler'],
}

export default config
