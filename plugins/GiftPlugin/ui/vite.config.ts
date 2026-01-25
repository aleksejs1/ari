import { createPluginConfig } from '../../../sdk/src/build/vite';

export default createPluginConfig({
  name: 'GiftPlugin',
  dirname: __dirname,
  entry: './src/index.tsx',
});
