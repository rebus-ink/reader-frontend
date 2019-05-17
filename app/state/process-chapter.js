import DOMPurify from 'dompurify'

const purifyConfig = {
  KEEP_CONTENT: false,
  RETURN_DOM: true,
  RETURN_DOM_FRAGMENT: true,
  RETURN_DOM_IMPORT: true,
  FORBID_TAGS: ['style', 'link'],
  FORBID_ATTR: ['style'],
  ADD_TAGS: ['reader-markers']
}

export function processChapter (chapter) {
  const doc = chapter.content
  const clean = DOMPurify.sanitize(doc, purifyConfig)
  const symbols = clean.querySelectorAll(
    'p, h1, h2, h3, h4, h5, h6, li, table, dd, dt, div > img:only-child, figure > img'
  )
  symbols.forEach(element => {
    if (element.tagName.toLowerCase() === 'img') {
      element = element.parentElement
    }
    // if (element.tagName.toLowerCase() === 'blockquote' && element.parentElement.tagName.toLowerCase() === 'blockquote') {
    //   return
    // }
    let xpath = element.dataset.location
    if (!xpath) {
      xpath = element.dataset.location = getXPath(element)
    }
    const markerContainer = window.document.createElement('reader-markers')
    markerContainer.classList.add('Marker')
    markerContainer.dataset.reader = 'true'
    markerContainer.dataset.for = xpath
    element.appendChild(markerContainer)
    const annotations = getAnnotations(chapter.replies, element.dataset.location)
    annotations.forEach(annotation => {
      if (annotation.summary && !annotation.content) {
        markerContainer.dataset.noteId = annotation.id
      } else {
        addNote(annotation, element, window.document, DOMPurify)
      }
    })
    // addAnnotationTools(element)
  })
  return clean
}

function getAnnotations (replies = [], xpath) {
  return replies.filter(reply => {
    if (
      reply['oa:hasSelector'] &&
      reply['oa:hasSelector'].type === 'XPathSelector' &&
      !reply['oa:hasSelector'].start &&
      !reply['oa:hasSelector'].end
    ) {
      return reply['oa:hasSelector'].value === xpath
    } else {
      return false
    }
  })
}

function addNote (note, element, document, DOMPurify) {
  const xpath = element.dataset.location
  const div = document.createElement('div')
  div.dataset.for = xpath
  div.dataset.reader = 'true'
  div.dataset.component = 'reader-note'
  div.dataset.noteId = note.id
  div.classList.add('ReaderNote')
  div.id = 'ReaderNote-' + xpath
  element.parentElement.insertBefore(div, element.nextSibling)
}

// Parts of this derived from https://github.com/tilgovi/simple-xpath-position/blob/master/src/xpath.js (MIT Licensed)
function getXPath (element) {
  if (!element) {
    return null
  } else if (element.id) {
    return `//*[@id=${element.id}]`
  } else {
    let path = '/'
    while (element) {
      if (!element.tagName) {
        path = `/html[1]/body[1]${path}`
      } else {
        path = `/${element.tagName.toLowerCase()}[${nodePosition(
          element
        )}]${path}`
      }
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
