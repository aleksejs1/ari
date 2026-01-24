import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vite'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'

export default defineConfig({
  plugins: [react(), cssInjectedByJsPlugin()],
  define: {
    'process.env': {}
  },
  resolve: {
    alias: [
      { find: /^react$/, replacement: path.resolve(__dirname, '../../../sdk/src/shim/react.ts') },
      { find: /^react-dom$/, replacement: path.resolve(__dirname, '../../../sdk/src/shim/react-dom.ts') },
      { find: '@tanstack/react-query', replacement: path.resolve(__dirname, '../../../sdk/src/shim/react-query.ts') },
      { find: 'react-i18next', replacement: path.resolve(__dirname, '../../../sdk/src/shim/react-i18next.ts') },
      { find: 'react-router-dom', replacement: path.resolve(__dirname, '../../../sdk/src/shim/react-router-dom.ts') },
      { find: 'react/jsx-runtime', replacement: path.resolve(__dirname, '../../../sdk/src/shim/jsx-runtime.ts') },
      { find: '@ari/plugin-sdk', replacement: path.resolve(__dirname, '../../../sdk/src/index.ts') },
      { find: '@', replacement: path.resolve(__dirname, './src') },
    ],
  },
  build: {
    outDir: 'dist',
    lib: {
      entry: path.resolve(__dirname, 'src/index.tsx'),
      name: 'GiftPlugin',
      fileName: 'gift-plugin',
      formats: ['es'],
    },
    rollupOptions: {
      external: [], // We bundle everything (shims), so no externals
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
  },
})
