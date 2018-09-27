const autoprefixer = require('autoprefixer')
const postcss = require('postcss')
const cssnano = require('cssnano')
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
    easyImport,
    require('stylelint'),
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
      fs.writeFile('static/styles/app.css', result.css, () =>
        console.log('app.css')
      )
      if (result.map) {
        fs.writeFile('static/styles/app.css.map', result.map, () =>
          console.log('app.css.map')
        )
      }
    })
})
