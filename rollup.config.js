
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import { terser } from 'rollup-plugin-terser'

export default {
  input: ['app/index.js', 'app/annotations/annotations.js', 'app/importer/importer.js', 'app/importer/zip.js'],
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
