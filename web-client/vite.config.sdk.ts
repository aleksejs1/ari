import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': {},
  },
  build: {
    outDir: 'public/assets',
    emptyOutDir: false,
    lib: {
      entry: path.resolve(__dirname, '../sdk/src/index.ts'),
      name: 'AriSdk',
      fileName: () => 'sdk.js',
      formats: ['es'],
    },
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        'react-router-dom',
        '@tanstack/react-query',
        'lucide-react',
        'react-hook-form',
        '@hookform/resolvers/zod',
        'react-i18next',
        'i18next',
        // Note: axios, clsx, tailwind-merge, zod ARE bundled into SDK facade
      ],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react-router-dom': 'ReactRouterDOM',
          '@tanstack/react-query': 'ReactQuery',
          'lucide-react': 'lucide',
          'react-hook-form': 'ReactHookForm',
          '@hookform/resolvers/zod': 'ZodResolver',
          'react-i18next': 'ReactI18next',
          i18next: 'i18n',
        },
      },
    },
  },
})
