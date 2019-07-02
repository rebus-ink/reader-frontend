
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import { terser } from 'rollup-plugin-terser'
import unassert from 'rollup-plugin-unassert'
import glob from 'glob'
const input = glob.sync('app/vendor/*.js')

export default {
  input,
  output: [{
    dir: 'js/vendor',
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
    terser()
  ]
}
