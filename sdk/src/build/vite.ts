import { type UserConfig } from 'vite';
import react from '@vitejs/plugin-react';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';
import path from 'path';
import { fileURLToPath } from 'url';
import { visualizer } from 'rollup-plugin-visualizer';

export function createPluginConfig(
    name: string,
    importerUrl: string,
    options: { entry?: string } = {}
): UserConfig {
    const root = path.dirname(fileURLToPath(importerUrl));
    const entry = options.entry || './src/index.tsx';

    return {
        root,
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
                { find: '@ari/plugin-sdk', replacement: path.resolve(root, '../../../sdk/src') },
                { find: '@', replacement: path.resolve(root, './src') },
            ],
        },
        build: {
            outDir: 'dist',
            emptyOutDir: true,
            lib: {
                entry: path.resolve(root, entry),
                name,
                fileName: (format) => `${name.toLowerCase().replace(/plugin$/, '-plugin')}.js`,
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
                    'date-fns',
                    'date-fns/locale',
                    'class-variance-authority',
                    'clsx',
                    'tailwind-merge',
                    /^@radix-ui\/.*/,
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
            setupFiles: [path.resolve(root, '../../../sdk/src/test/setup.ts')],
        },
        server: {
            cors: true,
        },
        preview: {
            cors: true,
        },
    };
}
