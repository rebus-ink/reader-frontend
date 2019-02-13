const browserify = require('browserify')
const fs = require('fs')

function bundleFiles (input, output) {
  return browserify(input)
    .transform('unassertify', { global: true })
    .transform('uglifyify', { global: true })
    .plugin('common-shakeify')
    .plugin('browser-pack-flat/plugin')
    .bundle()
    .pipe(require('minify-stream')({ sourceMap: false }))
    .pipe(fs.createWriteStream(output))
}

bundleFiles('components/importer/index.js', './js/importer.min.js')
bundleFiles('components/annotations/index.js', './js/annotations.min.js')
