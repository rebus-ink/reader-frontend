const viperHTML = require('viperhtml')
const { page } = require('../views/page.js')
const { ensureLogin } = require('../ensure-login.js')
const express = require('express')
const router = express.Router()
const debug = require('debug')('vonnegut:routes:chapter')
const { getBookState } = require('../utils/get-book-state.js')
const { arrify } = require('../utils/arrify.js')
const csurf = require('csurf')
const got = require('got')
const createDOMPurify = require('dompurify')
const { JSDOM } = require('jsdom')
const { serializeToString } = require('xmlserializer')
const path = require('path')
const { pageBody } = require('../views/render-body.js')

const purifyConfig = {
  KEEP_CONTENT: false,
  IN_PLACE: true,
  FORBID_TAGS: ['style', 'link'],
  FORBID_ATTR: ['style'],
  ADD_TAGS: ['reader-markers'],
  ADD_ATTR: ['epub:type']
}

router.get('/asset/:bookId/*', ensureLogin, csurf(), function (req, res, next) {
  debug(req.path)
  return getBookState(req, res)
    .then(model => {
      debug('got model')
      debug(getAlternate(model.chapter))
      if (model.chapter.type === 'Document') {
        // This needs to be dependent on media type not model type
        const resource = getAlternate(model.chapter)
        return getChapter(resource, req.path)
          .then(body => {
            const json = () => {
              const data = model.chapter
              data.content = body
              data.mediaType = 'text/html'
              res.send(data)
            }
            if (req.query.json) {
              return json()
            } else {
              res.format({
                'text/html': () => {
                  const render = viperHTML.wire
                  res.send(page(render, {}, req, () => [body]))
                },
                'application/activity+json': json,
                'application/ld+json': json,
                'application/json': json
              })
            }
          })
          .catch(err => {
            debug(err)
            return res.sendStatus(404)
          })
      } else {
        // This should _not_ redirect non image resources to the image end route.
        const altURL = getAlternate(model.chapter)
        // Remember to check 'encodingFormat' on the LinkResource object here when we switch to WPUB.
        if (path.extname(altURL) === '.svg') {
          // This should use the actual media type
          return res.redirect(`/images/svg/${encodeURIComponent(altURL)}`)
        } else {
          return res.redirect(`/images/proxy/${encodeURIComponent(altURL)}`)
        }
      }
    })
    .catch(err => next(err))
})

router.get('/reader/:bookId/*', ensureLogin, csurf(), function (req, res, next) {
  debug(req.path)
  return getBookState(req, res)
    .then(model => {
      debug('got model')
      debug(getAlternate(model.chapter))
      if (model.chapter.type === 'Document') {
        const render = viperHTML.wire
        res.type('html')
        res.send(page(render, {}, req, pageBody))
      } else {
        // This should _not_ redirect non image resources to the image end route.
        const altURL = getAlternate(model.chapter)
        // Remember to check 'encodingFormat' on the LinkResource object here when we switch to WPUB.
        if (path.extname(altURL) === '.svg') {
          // This should use the actual media type
          return res.redirect(`/images/svg/${encodeURIComponent(altURL)}`)
        } else {
          return res.redirect(`/images/proxy/${encodeURIComponent(altURL)}`)
        }
      }
    })
    .catch(err => next(err))
})

async function getChapter (resource, path) {
  const response = await got(resource)
  if (response.statusCode === 404) {
    const err = new Error('Resource not found')
    err.status = 404
    throw err
  }
  const base = `${process.env.BASE}${path}`
  const dom = new JSDOM(response.body, {
    url: base,
    contentType: response.headers['content-type'] || 'text/html'
  })
  const window = dom.window
  const DOMPurify = createDOMPurify(window)
  const media = window.document.body.querySelectorAll('[src]')
  media.forEach(link => {
    link.setAttribute('src', link.src)
  })
  const links = window.document.body.querySelectorAll('[href]')
  links.forEach(link => {
    link.setAttribute('href', link.href)
  })
  const clean = DOMPurify.sanitize(window.document.body, purifyConfig)
  debug('Chapter processed')
  let result
  if (response.headers['content-type'] !== 'text/html') {
    result = serializeToString(clean)
  } else {
    result = clean.innerHTML
  }
  return result
}

function getAlternate (chapter) {
  const urls = arrify(chapter.url)
  const link = urls.filter(item => item.rel.indexOf('alternate') !== -1)[0]
  if (link) {
    return link.href
  } else {
    return '/static/placeholder-cover.png'
  }
}

module.exports = router
