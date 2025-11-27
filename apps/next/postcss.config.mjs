import { existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import process from 'process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Find monorepo root by traversing up until we find node_modules/reshaped
function findMonorepoRoot(startDir) {
  let currentDir = startDir;
  while (currentDir !== path.dirname(currentDir)) {
    const nodeModulesPath = path.join(currentDir, 'node_modules', 'reshaped');
    if (existsSync(nodeModulesPath)) {
      return currentDir;
    }
    currentDir = path.dirname(currentDir);
  }
  return startDir;
}

const monorepoRoot = findMonorepoRoot(__dirname);
const themeMediaCSSPath = path.resolve(
  monorepoRoot,
  'node_modules/reshaped/dist/themes/reshaped/media.css',
);

const plugins = {
  '@csstools/postcss-global-data': {
    files: [themeMediaCSSPath],
  },
  'postcss-custom-media': {},
  autoprefixer: {},
};

if (process.env.NODE_ENV === 'production') {
  plugins.cssnano = {
    preset: [
      'default',
      {
        calc: false,
        discardComments: { removeAll: true },
        normalizeUrl: false,
        mergeRules: false,
        zindex: false,
        reduceTransforms: false,
        normalizeWhitespace: false,
        reduceIdents: false,
        minifyFontValues: false,
      },
    ],
  };
}

const postcssConfig = {
  plugins,
};

export default postcssConfig;
