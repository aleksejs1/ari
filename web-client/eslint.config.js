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
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', 'node_modules', 'public', 'src/types/schema.d.ts', 'coverage']),
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
        {
          type: 'pages',
          pattern: 'src/pages/**/*',
        },
        {
          type: 'features',
          pattern: 'src/features/**/*',
        },
        {
          type: 'components',
          pattern: 'src/components/**/*',
        },
        {
          type: 'hooks',
          pattern: 'src/hooks/**/*',
        },
        {
          type: 'contexts',
          pattern: 'src/contexts/**/*',
        },
        {
          type: 'lib',
          pattern: 'src/lib/**/*',
        },
        {
          type: 'types',
          pattern: 'src/types/**/*',
        },
      ],
    },
    plugins: {
      'react-refresh': reactRefresh,
      import: importPlugin,
      boundaries,
    },
    rules: {
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
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
            {
              from: 'components',
              disallow: ['features', 'pages'],
            },
            {
              from: 'hooks',
              disallow: ['features', 'pages'],
            },
            {
              from: 'contexts',
              disallow: ['features', 'pages'],
            },
            {
              from: 'lib',
              disallow: ['features', 'pages', 'components', 'hooks', 'contexts'],
            },
            {
              from: 'types',
              disallow: ['features', 'pages', 'components', 'hooks', 'contexts', 'lib'],
            },
          ],
        },
      ],
    },
  },
])
