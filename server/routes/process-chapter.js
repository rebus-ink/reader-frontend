const { ensureLogin } = require('../ensure-login.js')
const express = require('express')
const router = express.Router()
const got = require('got')
const debug = require('debug')('vonnegut:routes:process-chapter')
const createDOMPurify = require('dompurify')
const { JSDOM } = require('jsdom')
const csurf = require('csurf')

const purifyConfig = {
  KEEP_CONTENT: false,
  IN_PLACE: true,
  FORBID_TAGS: ['style', 'link'],
  FORBID_ATTR: ['style'],
  ADD_TAGS: ['reader-markers']
}

router.get('/process-chapter', ensureLogin, csurf(), async function (
  req,
  res,
  next
) {
  debug(req.path)
  const base = `${process.env.BASE}/reader/${req.query.bookId}/${
    req.query.path
  }`
  debug(base)
  try {
    const resource = req.query.resource
    const response = await got(resource)
    if (response.statusCode === 404) {
      return res.sendStatus(404)
    }
    const window = new JSDOM(response.body, { url: base }).window
    const DOMPurify = createDOMPurify(window)
    const symbols = window.document.body.querySelectorAll(
      'p, h1, h2, h3, h4, h5, h6, li, table, dd, dt, div > img:only-child, figure > img'
    )
    symbols.forEach(element => {
      if (element.tagName.toLowerCase() === 'img') {
        element = element.parentElement
      }
      element.dataset.location = getXPath(element)
    })
    const media = window.document.body.querySelectorAll('[src]')
    media.forEach(link => {
      link.setAttribute('src', link.src)
    })
    const clean = DOMPurify.sanitize(window.document.body, purifyConfig)
    debug('Chapter processed')
    return res.send({ chapter: clean.innerHTML })
  } catch (err) {
    return res.sendStatus(404)
  }
})

// Parts of this derived from https://github.com/tilgovi/simple-xpath-position/blob/master/src/xpath.js (MIT Licensed)
function getXPath (element) {
  if (!element) {
    return null
  } else if (element.id) {
    return `//*[@id=${element.id}]`
  } else {
    const root = element.ownerDocument
    let path = '/'
    while (element !== root) {
      if (!element) {
        throw new Error('Element not contained by root')
      }
      path = `/${element.tagName.toLowerCase()}[${nodePosition(
        element
      )}]${path}`
      element = element.parentNode
    }
    return path.replace(/\/$/, '')
  }
}
function nodePosition (node) {
  let name = node.nodeName
  let position = 1
  while ((node = node.previousSibling)) {
    if (node.nodeName === name) position += 1
  }
  return position
}

module.exports = router
