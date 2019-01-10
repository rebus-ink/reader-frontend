const sanitizeHtml = require('sanitize-html')

const options = {
  transformTags: {
    h1: 'h2',
    h2: 'h3',
    h3: 'h4',
    h4: 'h5',
    h5: 'h6'
  },
  nonTextTags: ['style', 'script', 'textarea', 'title'],
  allowedTags: sanitizeHtml.defaults.allowedTags.concat([
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'img',
    'video',
    'audio',
    'source',
    'figure',
    'figcaption',
    'dl',
    'dd',
    'dt',
    'section',
    'article',
    'aside',
    'detail',
    'summary',
    'div'
  ])
}

function clean (dirty) {
  return sanitizeHtml(dirty, options)
}

const htmlProps = ['contents', 'content', 'toc']
function makeModelSafe (model) {
  const safe = {}
  htmlProps.forEach(prop => {
    safe[prop] = clean(model[prop])
  })
  return Object.assign({}, model, safe)
}

module.exports = {
  clean,
  makeModelSafe
}

// We will have to switch to using dompurify, both browser- and serverside, eventually. If not just for better svg support. We ignore forms to begin with until we can figure out better support.
