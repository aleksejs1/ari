import react from '@vitejs/plugin-react'
import path from 'path'
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
    setupFiles: './src/test/setup.tsx',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      all: true,
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
})
