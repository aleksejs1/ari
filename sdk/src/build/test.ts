import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function createTestConfig({ dirname }: { dirname: string }) {
    return defineConfig({
        plugins: [react()],
        test: {
            globals: true,
            environment: 'jsdom',
            setupFiles: [path.resolve(__dirname, '../test/setup.ts')],
            css: false,
            alias: {
                '@': path.resolve(dirname, './src'),
                '@ari/plugin-sdk': path.resolve(__dirname, '../index.ts'),
            },
        },
    });
}
