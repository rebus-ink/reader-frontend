
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import { terser } from 'rollup-plugin-terser'
import { string } from 'rollup-plugin-string'
import unassert from 'rollup-plugin-unassert'
import glob from 'glob'
const input = glob.sync('components/**/*.{component,hook,state}.js')

export default {
  input,
  output: [{
    dir: 'js/components',
    format: 'es',
    sourcemap: true
  }],
  plugins: [
    unassert(),
    resolve({
      preferBuiltins: false,
      browser: true
    }),
    commonjs(),
    string({
      // Required to be specified
      include: '**/*.{txt,css}' }),
    terser()
  ]
}
