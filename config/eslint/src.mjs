import config from 'eslint-config-holy-grail';
import { defineConfig } from 'eslint/config';

// eslint-disable-next-line import/no-default-export
export default defineConfig([{ extends: [config] }]);
