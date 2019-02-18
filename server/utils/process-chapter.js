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
    const markerContainer = window.document.createElement('span')
    markerContainer.classList.add('Marker')
    markerContainer.dataset.reader = 'true'
    element.appendChild(markerContainer)
    const annotations = getAnnotations(chapter.replies, element.dataset.xpath)
    annotations.forEach(annotation => {
      if (annotation.summary && !annotation.content) {
        const marker = addMarker(annotation, window.document)
        markerContainer.appendChild(marker)
      } else {
        addNote(annotation, element, window.document, DOMPurify)
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

const descriptions = {
  '✓': 'agree',
  x: 'disagree',
  '~': 'interesting',
  '*': 'important',
  '👍': 'thumbs up',
  '👎': 'thumbs down',
  '✋': 'open hand',
  '👏': 'clapping',
  '🙂': 'slightly smiling face',
  '🤨': 'face with raised eyebrows',
  '😍': 'smiling face with heart-shaped eyes',
  '😱': 'face screaming in fear',
  '😐': 'neutral face',
  '🙄': 'face with rolling eyes'
}

function addMarker (marker, document) {
  const description = descriptions[marker.summary]
  const label = `Remove '${description}' sidebar marker`
  const button = document.createElement('button')
  button.classList.add('Button')
  button.classList.add('Button--marker')
  button.setAttribute('aria-label', label)
  button.setAttribute('is', 'marker-button')
  button.dataset.description = description
  button.textContent = marker.summary
  return button
}

function addNote (note, element, document, DOMPurify) {
  const xpath = element.dataset.xpath
  const form = document.createElement('form')
  form.dataset.for = xpath
  form.dataset.reader = 'true'
  form.classList.add('ReaderNote')
  form.classList.add('ReaderNote--preRendered')
  form.id = 'ReaderNote-' + xpath
  const textareaId = 'ReaderNote-text-' + xpath
  form.innerHTML = `<div class="ReaderNote-textarea ql-container" id="${textareaId}" data-reader="true" aria-label="Note"><div class="ql-editor">
  ${DOMPurify.sanitize(note.content)}</div></div>`
  element.parentElement.insertBefore(form, element.nextSibling)
}

module.exports.processChapter = processChapter
