
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import { terser } from 'rollup-plugin-terser'

export default {
  input: ['components/importer/importer.js', 'components/annotations/annotations.js'],
  output: {
    dir: 'js',
    format: 'es',
    sourcemap: true
  },
  plugins: [
    resolve(),
    commonjs(),
    terser()
  ]
}
