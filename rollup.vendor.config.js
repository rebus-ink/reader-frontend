
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import { terser } from 'rollup-plugin-terser'

export default {
  input: ['vendor/zip.js', 'vendor/quill.js'],
  output: [{
    dir: 'js/module',
    format: 'es',
    sourcemap: true
  }, {
    dir: 'js/nomodule',
    format: 'system',
    sourcemap: true
  }],
  plugins: [
    resolve({
      preferBuiltins: false,
      browser: true
    }),
    commonjs(),
    terser()
  ]
}
