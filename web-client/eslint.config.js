import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import react from 'eslint-plugin-react'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import importPlugin from 'eslint-plugin-import'
import eslintConfigPrettier from 'eslint-config-prettier'
import boundaries from 'eslint-plugin-boundaries'
import pluginQuery from '@tanstack/eslint-plugin-query'
import sonarjs from 'eslint-plugin-sonarjs'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores([
    'dist',
    'node_modules',
    'node_modules_trash',
    'public',
    'src/types/schema.d.ts',
    'coverage',
  ]),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.strict,
      ...tseslint.configs.stylistic,
      react.configs.flat.recommended,
      react.configs.flat['jsx-runtime'],
      jsxA11y.flatConfigs.recommended,
      reactHooks.configs.flat.recommended,
      eslintConfigPrettier,
      boundaries.configs.recommended,
      ...pluginQuery.configs['flat/recommended'],
      sonarjs.configs.recommended,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        ...globals.es2020,
      },
      parserOptions: {
        project: ['./tsconfig.app.json', './tsconfig.node.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
      'boundaries/elements': [
        // 1. Core / Shared Layers
        {
          type: 'core',
          pattern: 'src/{lib,components,contexts,hooks,types}/**',
        },
        // 2. Plugins (Capture the specific plugin name!)
        {
          type: 'plugin',
          pattern: 'src/plugins/([^/]+)/**',
          capture: ['pluginName'],
        },
        // 3. Application Root (Entry points)
        {
          type: 'app',
          pattern: 'src/{pages,App.tsx,main.tsx}',
        },
        // 4. Legacy Features (if strictly separated)
        {
          type: 'feature',
          pattern: 'src/features/**',
        },
      ],
    },
    plugins: {
      'react-refresh': reactRefresh,
      import: importPlugin,
      boundaries,
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      'react/jsx-no-leaked-render': ['error', { validStrategies: ['ternary', 'coerce'] }],
      'react/jsx-boolean-value': ['error', 'never'],
      'react/jsx-curly-brace-presence': ['error', { props: 'never', children: 'never' }],
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/switch-exhaustiveness-check': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-explicit-any': 'off',
      'import/order': 'off',
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            // Side effect imports
            ['^\\u0000'],
            // React and other built-ins
            ['^react', '^@?\\w'],
            // Internal packages (Core, Lib, Hooks, Components)
            ['^@/(lib|components|hooks|contexts|types)(/.*|$)'],
            // Plugins
            ['^@/plugins(/.*|$)'],
            // Features (Legacy)
            ['^@/features(/.*|$)'],
            // Layouts/Pages/App
            ['^@/(pages|layouts|App)(/.*|$)'],
            // Parent imports. Put `..` last.
            ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
            // Other relative imports. Put same-folder imports and `.` last.
            ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
            // Style imports.
            ['^.+\\.?(css)$'],
          ],
        },
      ],
      'simple-import-sort/exports': 'error',
      'import/no-duplicates': 'error',
      eqeqeq: ['error', 'always'],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      curly: ['error', 'all'],
      'react/prop-types': 'off',
      'react/self-closing-comp': 'error',
      complexity: ['warn', 10],
      'max-depth': ['warn', 4],
      'max-params': ['warn', 4],
      'boundaries/element-types': [
        'error',
        {
          default: 'allow',
          message: '${file.type} is not allowed to import ${dependency.type}',
          rules: [
            // 1. Lib is the lowest layer
            {
              from: 'core',
              disallow: ['plugin', 'app', 'feature'],
              message: 'Core/Shared modules cannot import Plugins or App logic.',
            },
            // 3. Plugins can use Core and Lib, but NOT other Plugins (unless registered? no, strict isolation)
            {
              from: 'plugin',
              disallow: [
                ['plugin', { pluginName: '!${from.pluginName}' }], // Block other plugins
                'app',
              ],
              message:
                'Plugins must be isolated. Cannot import other plugins or App root directly.',
            },
            // 4. Features (Legacy) - Lock them down
            {
              from: 'feature',
              disallow: ['plugin', 'app'],
            },
            // App layer (pages) can import anything generally, but let's be safe?
            // Usually Pages integrate Plugins.
          ],
        },
      ],
      'sonarjs/prefer-read-only-props': 'off',
    },
  },
])
