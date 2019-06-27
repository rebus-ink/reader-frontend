const { ensureLogin } = require('../ensure-login.js')
const express = require('express')
const router = express.Router()
const debug = require('debug')('vonnegut:routes:assets')
const csurf = require('csurf')
const got = require('got')
const createDOMPurify = require('dompurify')
const { JSDOM } = require('jsdom')
const { serializeToString } = require('xmlserializer')

const purifyConfig = {
  KEEP_CONTENT: false,
  IN_PLACE: true,
  ADD_ATTR: ['epub:type', 'xmlns:epub'],
  ADD_TAGS: ['preview-app', 'link'],
  WHOLE_DOCUMENT: true
}

router.get('/asset/:proxyURL*', ensureLogin, csurf(), function (req, res, next) {
  debug(req.params.proxyURL)
  return assets(req.params.proxyURL, res).catch(err => {
    console.error(err)
    return res.sendStatus(404)
  })
})

async function assets (url, res) {
  const response = await got.head(url)
  if (response.headers['content-type'].includes('script')) {
    return res.sendStatus(404)
  }
  res.set('Cache-Control', 'max-age=31536000, immutable')
  if (response.headers['content-type'].includes('svg')) {
    const mainresponse = await got(url)
    const dom = new JSDOM(mainresponse.body, {
      contentType: response.headers['content-type']
    })
    const window = dom.window
    const DOMPurify = createDOMPurify(window)
    const clean = DOMPurify.sanitize(
      window.document.documentElement,
      purifyConfig
    )
    const result = serializeToString(clean)
    res.type('svg')
    res.send(result)
  } else if (response.headers['content-type'].includes('xhtml')) {
    const mainresponse = await got(url)
    const dom = new JSDOM(mainresponse.body, {
      contentType: response.headers['content-type'] || 'application/xhtml+xml'
    })
    const window = dom.window
    const DOMPurify = createDOMPurify(window)
    const clean = DOMPurify.sanitize(
      window.document.documentElement,
      purifyConfig
    )
    const result = serializeToString(clean)
    res.type('application/xhtml+xml')
    res.send(result)
  } else if (response.headers['content-type'].includes('html')) {
    const mainresponse = await got(url)
    const dom = new JSDOM(mainresponse.body, {
      contentType: response.headers['content-type'] || 'text/html'
    })
    const window = dom.window
    const DOMPurify = createDOMPurify(window)
    const clean = DOMPurify.sanitize(
      window.document.documentElement,
      purifyConfig
    )
    let result
    if (response.headers['content-type'] !== 'text/html') {
      result = serializeToString(clean)
    } else {
      result = clean.outerHTML
    }
    res.type('html')
    res.send(result)
  } else if (response.headers['content-type'].includes('text')) {
    const mainresponse = await got(url)
    res.type(mainresponse.headers['content-type'])
    res.send(mainresponse.body)
  } else if (response.headers['content-type'].includes('image')) {
    return res.redirect(`/images/proxy/${encodeURIComponent(url)}`)
  } else {
    return got.stream(url).pipe(res)
  }
}

module.exports = router
