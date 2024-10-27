import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';
export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/ascii-engine.js',
      format: 'iife',
      name: 'AsciiEngine',
    },
    {
      file: 'dist/ascii-engine.esm.js',
      format: 'es',
    },
  ],
  plugins: [typescript(), terser()],
};
