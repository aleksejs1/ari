import react from '@vitejs/plugin-react'
import path from 'path'
import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig } from 'vite'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'

export default defineConfig({
  plugins: [
    react(),
    cssInjectedByJsPlugin(),
    visualizer({
      open: false,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  define: {
    'process.env': {}
  },
  resolve: {
    alias: [
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
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        'react-router-dom',
        'react-i18next',
        '@tanstack/react-query',
        'react-hook-form',
        'zod',
        'tailwind-merge',
        'clsx',
        'axios',
        '@crm/ui',
        /^@radix-ui\/.*/,
        '@hookform/resolvers/zod',
        '@hookform/resolvers',
        'lucide-react'
      ],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react-router-dom': 'ReactRouterDOM',
          'react-i18next': 'ReactI18next',
          '@tanstack/react-query': 'ReactQuery',
          'react-hook-form': 'ReactHookForm',
          'zod': 'Zod',
          'tailwind-merge': 'twMerge',
          'clsx': 'clsx',
          'axios': 'axios',
          '@crm/ui': 'CrmUi'
        },
      },
    },
  },
})
