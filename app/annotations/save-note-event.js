export function saveXpathNote (note, xpath) {
  // Needs publication url (context) and document url (inReplyTo)
  const payload = {
    type: 'Note',
    'oa:hasSelector': {
      type: 'XPathSelector',
      value: xpath
    },
    content: note
  }
  console.log('saving: ', payload)
  // Receiver should find data-for that xpath and add data-act-id
  document.body.dispatchEvent(
    new window.CustomEvent('reader:save-note', {
      detail: { type: 'Create', object: payload }
    })
  )
}

export function updateXpathNote (note, xpath, actId) {
  const payload = {
    type: 'Note',
    id: actId,
    'oa:hasSelector': {
      type: 'XPathSelector',
      value: xpath
    },
    content: note
  }
  console.log('updating: ', payload)
  document.body.dispatchEvent(
    new window.CustomEvent('reader:update-note', {
      detail: { type: 'Update', object: payload }
    })
  )
}

export function saveQuoteNote (note, texts, startElement, endElement, rangeId) {
  // Needs publication url (context) and document url (inReplyTo)
  const payload = {
    type: 'Note',
    'oa:hasSelector': {
      type: 'reader:HighlightSelector',
      startElement,
      endElement,
      rangeId,
      value: texts
    },
    content: note
  }
  console.log(payload)
  // Receiver should update highlight data-range-id
  document.body.dispatchEvent(
    new window.CustomEvent('reader:save-note', {
      detail: { type: 'Create', object: payload }
    })
  )
}
