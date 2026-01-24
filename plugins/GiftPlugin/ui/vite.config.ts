import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'
import path from 'path'

export default defineConfig({
  plugins: [react(), cssInjectedByJsPlugin()],
  define: {
    'process.env': {}
  },
  resolve: {
    alias: [
      { find: /^react$/, replacement: path.resolve(__dirname, './src/react-shim.ts') },
      { find: /^react-dom$/, replacement: path.resolve(__dirname, './src/react-dom-shim.ts') },
      { find: '@tanstack/react-query', replacement: path.resolve(__dirname, './src/react-query-shim.ts') },
      { find: 'i18next', replacement: path.resolve(__dirname, './src/i18next-shim.ts') },
      { find: 'react-i18next', replacement: path.resolve(__dirname, './src/react-i18next-shim.ts') },
      { find: 'react-router-dom', replacement: path.resolve(__dirname, './src/react-router-dom-shim.ts') },
      { find: 'react/jsx-runtime', replacement: path.resolve(__dirname, './src/jsx-runtime-shim.ts') },
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
