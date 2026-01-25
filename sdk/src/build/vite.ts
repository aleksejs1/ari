import { defineConfig, type UserConfig } from 'vite';
import react from '@vitejs/plugin-react';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';
import path from 'path';
import { visualizer } from 'rollup-plugin-visualizer';

interface PluginConfigOptions {
    name: string; // Global variable name (e.g., 'GiftPlugin')
    entry?: string;
    dirname: string; // __dirname of the plugin
}

export function createPluginConfig({ name, dirname, entry = './src/index.tsx' }: PluginConfigOptions): UserConfig {
    return {
        plugins: [
            react(),
            cssInjectedByJsPlugin(),
            visualizer({
                open: false,
                gzipSize: true,
                brotliSize: true,
                filename: 'dist/stats.html'
            }),
        ],
        define: {
            'process.env': {}
        },
        resolve: {
            alias: [
                { find: '@ari/plugin-sdk', replacement: path.resolve(dirname, '../../../sdk/src/index.ts') },
                { find: '@', replacement: path.resolve(dirname, './src') },
            ],
        },
        build: {
            outDir: 'dist',
            emptyOutDir: true,
            lib: {
                entry: path.resolve(dirname, entry),
                name,
                fileName: (format) => `${name.toLowerCase().replace(/plugin$/, '-plugin')}.js`, // Force .js extension
                formats: ['es'],
            },
            rollupOptions: {
                external: [
                    'react',
                    'react-dom',
                    'react/jsx-runtime',
                    '@ari/plugin-sdk',
                    'react-router-dom',
                    '@tanstack/react-query',
                    'lucide-react',
                    'i18next',
                    'react-i18next',
                    // UI Libs provided by SDK
                    'date-fns',
                    'date-fns/locale',
                    'class-variance-authority',
                    'clsx',
                    'tailwind-merge',
                    /^@radix-ui\/.*/, // Regex for all radix packages
                ],
                output: {
                    globals: {
                        react: 'React',
                        'react-dom': 'ReactDOM',
                        '@ari/plugin-sdk': 'AriSdk',
                    },
                },
            },
        },
        test: {
            globals: true,
            environment: 'jsdom',
            include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
            setupFiles: [path.resolve(dirname, '../../../sdk/src/test/setup.ts')],
        },
    };
}
