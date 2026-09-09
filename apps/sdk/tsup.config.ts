import { defineConfig } from 'tsup';

// Two configs rather than one with format: ['cjs','esm'], because the CJS build
// needs a footer the ESM build must not get.
export default defineConfig([
  {
    entry: ['src/index.ts'],
    format: ['cjs'],
    dts: true,
    minify: true,
    clean: true,
    outDir: 'dist',
    // tsup emits `module.exports = { default: Hookpost }`, so `require(...)`
    // handed back a namespace object and `new require('@hookpost/node')()`
    // threw "not a constructor". Point module.exports at the class itself, and
    // keep .default aliased to it so code written against 1.0.0 still works.
    footer: {
      js: 'if (module.exports && module.exports.default) { const d = module.exports.default; module.exports = d; module.exports.default = d; }',
    },
  },
  {
    entry: ['src/index.ts'],
    format: ['esm'],
    dts: true,
    minify: true,
    clean: false,
    outDir: 'dist',
  },
]);
