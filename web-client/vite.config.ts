import path from 'path'

import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig } from 'vitest/config'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          // Disable React Compiler incompatibility warnings for TanStack Table
          ['babel-plugin-react-compiler', { compilationMode: 'annotation' }],
        ],
      },
    }),
    visualizer({
      open: false,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: true,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        'dist/',
        'eslint.config.js',
        'postcss.config.js',
        'tailwind.config.js',
      ],
      thresholds: {
        lines: 80,
        statements: 80,
        functions: 70,
        branches: 60,
      },
    },
  },
})
