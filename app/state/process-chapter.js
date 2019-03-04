import DOMPurify from 'dompurify'
import {html} from 'lighterhtml'

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

function addMarker (marker, document) {
  return html`<textarea class="Marker-textarea" aria-label="Sidebar note">${marker.summary}</textarea>`
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
