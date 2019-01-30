const got = require('got')
const debug = require('debug')('vonnegut:utils:process-chapter')
const Datastore = require('@google-cloud/datastore')
const namespace = 'rebus-reader-chapters'
const datastore = new Datastore({
  namespace
})
const { GKeyV } = require('./gkeyv.js')
const store = new GKeyV({ datastore })
const Keyv = require('keyv')
const storage = new Keyv({
  store,
  namespace: 'rebus-reader-chapters'
})
const createDOMPurify = require('dompurify')
const { JSDOM } = require('jsdom')

async function processChapter (url) {
  debug(url)
  const stored = await storage.get(url)
  if (stored) {
    debug('Chapter in storage')
    return stored
  } else {
    debug('Chapter _not_ in storage')
    const response = await got(url)
    const window = new JSDOM(response.body).window
    const DOMPurify = createDOMPurify(window)
    const symbols = window.document.body.querySelectorAll(
      'p, h1, h2, h3, h4, h5, h6, li, table, dd, dt'
    )
    symbols.forEach(element => {
      element.dataset.xpath = getXPath(element)
    })
    const clean = DOMPurify.sanitize(window.document.body, { IN_PLACE: true })
    await storage.set(url, clean.innerHTML)
    return clean.innerHTML
  }
}

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

module.exports.processChapter = processChapter
