import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import postcss from 'rollup-plugin-postcss';
import cssnano from 'cssnano';

const packageJson = require('./package.json');

export default [
  // CommonJS (for Node.js and older bundlers) and ES Module (for modern bundlers)
  {
    input: 'src/cue.js',
    output: [
      {
        file: 'dist/cue.cjs.js', // Explicitly name CJS file
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: packageJson.module, // dist/cue.esm.js
        format: 'esm',
        sourcemap: true,
      },
    ],
    plugins: [
      resolve(),
      commonjs(),
      postcss({
        // Process CSS from src/style.css
        extract: 'cue.css', // Extract CSS to a separate file in output directory
        plugins: [cssnano()] // Minify CSS using cssnano
      })
    ],
  },
  // UMD (for browser/CDN) and Minified UMD
  {
    input: 'src/cue.js', // Input now points to src/
    output: [
      {
        file: 'dist/cue.umd.js', // UMD format
        format: 'umd',
        name: 'Cue',
        sourcemap: true,
      },
      {
        file: packageJson.unpkg, // dist/cue.min.js
        format: 'umd',
        name: 'Cue',
        sourcemap: true,
        plugins: [terser()], // Minify JS
      },
    ],
    plugins: [
      resolve(),
      commonjs(),
      postcss({
        // Also process CSS for the UMD/minified builds
        extract: 'cue.min.css', // Extract minified CSS to cue.min.css
        plugins: [cssnano()] // Minify CSS
      })
    ],
  },
];