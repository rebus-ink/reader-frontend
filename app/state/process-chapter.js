import DOMPurify from 'dompurify'

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
    const xpath = element.dataset.location
    const markerContainer = window.document.createElement('reader-markers')
    markerContainer.classList.add('Marker')
    markerContainer.dataset.reader = 'true'
    markerContainer.dataset.for = xpath
    element.appendChild(markerContainer)
    const annotations = getAnnotations(chapter.replies, element.dataset.location)
    console.log(annotations)
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
      reply['oa:hasSelector'].type === 'XPathSelector'
    ) {
      return reply['oa:hasSelector'].value === xpath
    } else {
      return false
    }
  })
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
