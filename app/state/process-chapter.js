import DOMPurify from 'dompurify'
import { html } from 'lighterhtml'
import { markerMenu } from '../annotations/marker-menu.js'

const purifyConfig = {
  KEEP_CONTENT: false,
  RETURN_DOM_FRAGMENT: true,
  RETURN_DOM_IMPORT: true,
  FORBID_TAGS: ['style', 'link'],
  FORBID_ATTR: ['style'],
  ADD_TAGS: ['reader-markers']
}

export function processChapter (doc, chapter) {
  const clean = DOMPurify.sanitize(doc, purifyConfig)
  const symbols = clean.querySelectorAll(
    'p, h1, h2, h3, h4, h5, h6, li, table, dd, dt, div > img:only-child, figure > img'
  )
  symbols.forEach(element => {
    if (element.tagName.toLowerCase() === 'img') {
      element = element.parentElement
    }
    const markerContainer = window.document.createElement('reader-markers')
    markerContainer.classList.add('Marker')
    markerContainer.dataset.reader = 'true'
    element.appendChild(markerContainer)
    const annotations = getAnnotations(chapter.replies, element.dataset.location)
    annotations.forEach(annotation => {
      if (annotation.summary && !annotation.content) {
        const marker = addMarker(annotation, window.document)
        markerContainer.appendChild(marker)
      } else {
        addNote(annotation, element, window.document, DOMPurify)
      }
    })
    // addAnnotationTools(element)
  })
  return clean
}

// // Parts of this derived from https://github.com/tilgovi/simple-xpath-position/blob/master/src/xpath.js (MIT Licensed)
// function getXPath (element) {
//   if (!element) {
//     return null
//   } else if (element.id) {
//     return `//*[@id=${element.id}]`
//   } else {
//     const root = element.ownerDocument
//     let path = '/'
//     while (element !== root) {
//       if (!element) {
//         throw new Error('Element not contained by root')
//       }
//       path = `/${element.tagName.toLowerCase()}[${nodePosition(
//         element
//       )}]${path}`
//       element = element.parentNode
//     }
//     return path.replace(/\/$/, '')
//   }
// }
// function nodePosition (node) {
//   let name = node.nodeName
//   let position = 1
//   while ((node = node.previousSibling)) {
//     if (node.nodeName === name) position += 1
//   }
//   return position
// }

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
  const xpath = element.dataset.location
  const form = document.createElement('form')
  form.dataset.for = xpath
  form.dataset.reader = 'true'
  form.dataset.component = 'reader-note'
  form.classList.add('ReaderNote')
  form.id = 'ReaderNote-' + xpath
  const textareaId = 'ReaderNote-text-' + xpath
  form.innerHTML = `<div class="ReaderNote-textarea ql-container" id="${textareaId}" data-reader="true" aria-label="Note">
  ${DOMPurify.sanitize(note.content)}</div>`
  element.parentElement.insertBefore(form, element.nextSibling)
}

function addAnnotationTools (element) {
  const xpath = element.dataset.location
  if (!element.querySelector('.NoteButton')) {
    const button = html`<button class="Button Button--marker NoteButton" data-component="note-button" aria-label="Add note" data-for="${xpath}"><svg viewBox="0 0 10 10" fill="currentColor" stroke="transparent" width="15" height="15">
    <path d="m1 4h8v2h-8zm3-3h2v8h-2z"></path>
  </svg></button>`
    element.appendChild(button)
  }
  const menuContainer = element.querySelector('.Marker')
  if (menuContainer) {
    const menu = markerMenu(element)
    menuContainer.appendChild(menu)
  }
}
