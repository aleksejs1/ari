import { defineConfig, type UserConfig } from 'vite';
import react from '@vitejs/plugin-react';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';
import path from 'path';
import { visualizer } from 'rollup-plugin-visualizer';

interface PluginConfigOptions {
    name: string; // Global variable name (e.g., 'GiftPlugin')
    entry?: string;
    dirname: string; // __dirname плагина для резолва путей
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
            }),
        ],
        define: {
            'process.env': {}
        },
        resolve: {
            alias: [
                { find: '@ari/plugin-sdk', replacement: path.resolve(dirname, '../../../../sdk/src/index.ts') }, // Путь к SDK relative to plugin
                { find: '@', replacement: path.resolve(dirname, './src') },
            ],
        },
        build: {
            outDir: 'dist',
            // emptyOutDir: true, // Be careful with this in monorepos, but usually fine for plugins
            lib: {
                entry: path.resolve(dirname, entry),
                name,
                fileName: (format) => `${name.toLowerCase().replace(/plugin$/, '-plugin')}.js`, // Force .js extension
                formats: ['es'],
            },
            rollupOptions: {
                // Стандартный набор externals для всех плагинов
                external: [
                    'react', 'react-dom', 'react/jsx-runtime',
                    '@ari/plugin-sdk', '@ari/ui'
                ],
                output: {
                    globals: {
                        react: 'React',
                        'react-dom': 'ReactDOM',
                        '@ari/plugin-sdk': 'AriSdk',
                        '@ari/ui': 'SharedUI'
                    },
                },
            },
        },
    };
}
