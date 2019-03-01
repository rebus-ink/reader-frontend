const { ensureLogin } = require('../ensure-login.js')
const { getUserStreams } = require('../utils/get-user-streams.js')
const express = require('express')
const router = express.Router()
const got = require('got')
const debug = require('debug')('vonnegut:routes:process-chapter')
const createDOMPurify = require('dompurify')
const { JSDOM } = require('jsdom')
const URL = require('url').URL

const purifyConfig = {
  KEEP_CONTENT: false,
  IN_PLACE: true,
  FORBID_TAGS: ['style', 'link'],
  FORBID_ATTR: ['style'],
  ADD_TAGS: ['reader-markers']
}

router.get('/process-chapter', ensureLogin, getUserStreams, async function (
  req,
  res,
  next
) {
  debug(req.path)
  const base = `${process.env.BASE}/reader/${req.query.bookId}/${
    req.query.path
  }`
  const prefix = `${process.env.BASE}/reader/${req.query.bookId}`
  debug(base)
  try {
    const resource = req.query.resource
    const response = await got(resource)
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
    const links = window.document.body.querySelectorAll('[href]')
    links.forEach(link => {
      const href = new URL(link.href)
      const hash = href.hash
      const hashPrefix = link.href.replace(prefix, '')
      href.hash = hash.replace('#', `#${hashPrefix}:`)
      link.setAttribute('href', href.href)
    })
    const media = window.document.body.querySelectorAll('[src]')
    media.forEach(link => {
      link.setAttribute('src', link.src)
    })
    const clean = DOMPurify.sanitize(window.document.body, purifyConfig)
    debug('Chapter processed')
    return res.send({ chapter: clean.innerHTML })
  } catch (err) {
    res.status(404)
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
