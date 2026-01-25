import { dirname } from 'path';
import { fileURLToPath } from 'url';

import { createTestConfig } from '../../../sdk/src/build/test';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default createTestConfig({ dirname: __dirname });
