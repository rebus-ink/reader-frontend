const { ensureLogin } = require('../ensure-login.js')
const { getUserStreams } = require('../utils/get-user-streams.js')
const express = require('express')
const router = express.Router()
const got = require('got')
const debug = require('debug')('vonnegut:routes:process-chapter')
const createDOMPurify = require('dompurify')
const { JSDOM } = require('jsdom')

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
  debug(req.query)
  const resource = req.query.resource
  const response = await got(resource)
  const window = new JSDOM(response.body).window
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
  const clean = DOMPurify.sanitize(window.document.body, purifyConfig)
  debug('Chapter processed')
  return res.send({ chapter: clean.innerHTML })
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
