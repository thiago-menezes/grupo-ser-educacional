import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const themeMediaCSSPath = path.resolve(
  __dirname,
  'node_modules/reshaped/dist/themes/reshaped/media.css',
);

const postcssConfig = {
  plugins: {
    '@csstools/postcss-global-data': {
      files: [themeMediaCSSPath],
    },
    'postcss-custom-media': {},
    cssnano: { preset: ['default', { calc: false }] },
  },
};

export default postcssConfig;
