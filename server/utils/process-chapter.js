const got = require('got')
const debug = require('debug')('vonnegut:utils:process-chapter')
const createDOMPurify = require('dompurify')
const { JSDOM } = require('jsdom')
const { arrify } = require('../utils/arrify.js')

async function processChapter (chapter) {
  const url = getAlternate(chapter)
  debug(url)
  debug('Chapter - processing')
  const response = await got(url)
  const window = new JSDOM(response.body).window
  const DOMPurify = createDOMPurify(window)
  const symbols = window.document.body.querySelectorAll(
    'p, h1, h2, h3, h4, h5, h6, li, table, dd, dt'
  )
  symbols.forEach(element => {
    element.dataset.xpath = getXPath(element)
    const annotations = getAnnotations(chapter.replies, element.dataset.xpath)
    annotations.forEach(annotation => {
      if (annotation.subType === 'Marker') {
        addMarker(annotation, element, window.document, DOMPurify)
      } else {
        addNote(annotation, element, window.document)
      }
    })
  })
  const clean = DOMPurify.sanitize(window.document.body, { IN_PLACE: true })
  debug('Chapter processed')
  return clean.innerHTML
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

function getAlternate (chapter) {
  const urls = arrify(chapter.url)
  const link = urls.filter(item => item.rel.indexOf('alternate') !== -1)[0]
  if (link) {
    return link.href
  } else {
    return '/static/placeholder-cover.png'
  }
}

function getAnnotations (replies = [], xpath) {
  return replies.filter(reply => {
    if (
      reply['oa:hasSelector'] &&
      reply['oa:hasSelector'].type === 'XPathSelector'
    ) {
      return reply['oa:hasSelector'].value === xpath
    } else {
      return false
    }
  })
}

function addMarker (marker, element, document, DOMPurify) {
  const xpath = element.dataset.xpath
  const form = document.createElement('form')
  form.setAttribute('is', 'marker-annotation')
  form.dataset.for = xpath
  form.dataset.reader = 'true'
  form.classList.add = 'Marker'
  form.id = 'marker-' + xpath
  const textareaId = 'marker-text-' + xpath
  form.innerHTML = `<div class="Marker-textarea ql-container" id="${textareaId}" data-reader="true" aria-label="Sidebar note"><div class="ql-editor">
  ${DOMPurify.sanitize(marker.content)}</div></div>`
  element.appendChild(form)
}

function addNote (note, element, document, DOMPurify) {
  const xpath = element.dataset.xpath
  const form = document.createElement('form')
  form.setAttribute('is', 'reader-note')
  form.dataset.for = xpath
  form.dataset.reader = 'true'
  form.classList.add = 'ReaderNote'
  form.id = 'ReaderNote-' + xpath
  const textareaId = 'ReaderNote-text-' + xpath
  form.innerHTML = `<div class="ReaderNote-textarea ql-container" id="${textareaId}" data-reader="true" aria-label="Note"><div class="ql-editor">
  ${DOMPurify.sanitize(note.content)}</div></div>`
  element.parentElement.insertBefore(form, element.nextSibling)
}

module.exports.processChapter = processChapter
