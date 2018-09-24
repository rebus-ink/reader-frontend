const autoprefixer = require('autoprefixer')
const postcss = require('postcss')
const cssnano = require('cssnano')
const linter = require('postcss-bem-linter')
const properties = require('postcss-custom-properties')
const reporter = require('postcss-reporter')
const easyImport = require('postcss-easy-import')
const calc = require('postcss-calc')
const fs = require('fs')

fs.readFile('index.css', (err, css) => {
  if (err) {
    throw err
  }
  postcss([
    linter({
      implicitComponents: 'styles/components/**/*.css'
    }),
    easyImport,
    properties(),
    calc(),
    autoprefixer,
    reporter(),
    cssnano({
      preset: 'default'
    })
  ])
    .process(css, {
      from: 'index.css',
      to: 'static/app.css',
      map: { inline: false }
    })
    .then(result => {
      fs.writeFile('static/styles/app.css', result.css, () => true)
      if (result.map) {
        fs.writeFile('static/styles/app.css.map', result.map, () => true)
      }
    })
})
