import react from '@vitejs/plugin-react'
import path from 'path'
import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig } from 'vitest/config'

// https://vite.dev/config/
// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isTest = mode === 'test'

  const aliases = {
    '@': path.resolve(__dirname, './src'),
  }

  if (!isTest) {
    Object.assign(aliases, {
      react: 'https://esm.sh/react@19.2.0',
      'react-dom': 'https://esm.sh/react-dom@19.2.0',
      'react/jsx-runtime': 'https://esm.sh/react@19.2.0/jsx-runtime',
      'react/jsx-dev-runtime': 'https://esm.sh/react@19.2.0/jsx-dev-runtime',
      'react-router-dom': 'https://esm.sh/react-router-dom@7.1.1?external=react,react-dom',
      'react-i18next': 'https://esm.sh/react-i18next@15.2.0?external=react,react-dom',
      i18next: 'https://esm.sh/i18next@23.16.8',
      '@tanstack/react-query':
        'https://esm.sh/@tanstack/react-query@5.90.12?external=react,react-dom',
      'lucide-react': 'https://esm.sh/lucide-react@0.468.0?external=react,react-dom',
      'react-hook-form': 'https://esm.sh/react-hook-form@7.69.0?external=react',
      zod: 'https://esm.sh/zod@4.2.1',
      'tailwind-merge': 'https://esm.sh/tailwind-merge@3.4.0',
      clsx: 'https://esm.sh/clsx@2.1.1',
      axios: 'https://esm.sh/axios@1.6.2',
    })
  }

  return {
    plugins: [
      react(),
      visualizer({
        open: false,
        gzipSize: true,
        brotliSize: true,
      }),
    ],
    resolve: {
      alias: aliases,
    },
    server: {
      host: true,
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/test/setup.tsx',
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html'],
        include: ['src/**/*'],
        exclude: [
          'node_modules/',
          'src/test/',
          'dist/',
          'eslint.config.js',
          'postcss.config.js',
          'tailwind.config.js',
          '**/*.d.ts',
          '**/*.test.tsx',
          '**/*.test.ts',
          'src/main.tsx',
          'src/vite-env.d.ts',
        ],
        thresholds: {
          lines: 80,
          statements: 80,
          functions: 70,
          branches: 60,
        },
      },
    },
    build: {
      rollupOptions: {
        external: [
          'react',
          'react-dom',
          'react/jsx-runtime',
          'react-router-dom',
          'react-i18next',
          'i18next',
          '@tanstack/react-query',
          'lucide-react',
        ],
      },
    },
  }
})
