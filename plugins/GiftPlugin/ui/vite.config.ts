import { createPluginConfig } from '@ari/plugin-sdk/build/vite';
import path from 'path';

export default createPluginConfig('GiftPlugin', import.meta.url, {}, {
    resolve: {
        alias: {
            react: path.resolve('./node_modules/react'),
            'react-dom': path.resolve('./node_modules/react-dom'),
        }
    }
});

