
import { defineConfig } from 'vite';

import { createPluginConfig } from '../../../sdk/src/build/vite';

export default defineConfig(createPluginConfig({
  name: 'GiftPlugin',
  dirname: __dirname,
  entry: './src/index.tsx'
}));
