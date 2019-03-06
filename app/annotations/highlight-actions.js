import seek from 'dom-seek'
export function highlightNote (note) {
  const range = noteToRange(note)
  const containerElement = document.getElementById('chapter')
  const iterator = document.createNodeIterator(
    containerElement,
    window.NodeFilter.SHOW_TEXT
  )
  while (iterator.referenceNode !== range.startContainer) {
    iterator.nextNode()
  }
  var nodes = [iterator.referenceNode]
  while (iterator.referenceNode !== range.endContainer) {
    nodes.push(iterator.nextNode())
  }
  for (var i = 0; i < nodes.length; i++) {
    const node = nodes[i]
    if (
      !node.parentElement.closest('[data-reader]') &&
      !node.parentElement.closest('reader-highlight')
    ) {
      // Create a highlight
      const highlight = document.createElement('reader-highlight')
      highlight.dataset.noteId = note.id
      highlight.classList.add('Highlight')

      // Wrap it around the text node
      node.parentNode.replaceChild(highlight, node)
      highlight.appendChild(node)
    }
  }
}
export function rangeToNote (range) {
  let startElement
  if (range.startContainer.closest) {
    startElement = range.startContainer.closest('[data-location]')
  } else {
    startElement = range.startContainer.parentElement.closest('[data-location]')
  }
  let endElement
  if (range.endContainer.closest) {
    endElement = range.endContainer.closest('[data-location]')
  } else {
    endElement = range.endContainer.parentElement.closest('[data-location]')
  }
  const note = makeNote(startElement, range)
  if (startElement === endElement) {
    return makeXPathSelector(startElement, range, note)
  } else {
    return makeRangeSelector(startElement, endElement, range, note)
  }
}

export function noteToRange (note) {
  const range = document.createRange()
  const selector = note['oa:hasSelector']
  if (selector.type === 'XPathSelector') {
    const xpath = selector.value
    const start = selector.start
    const end = selector.end
    const container = document.querySelector(`[data-location="${xpath}"]`)
    const iterator = document.createNodeIterator(
      container,
      window.NodeFilter.SHOW_TEXT
    )
    const split = makeSplit(iterator)
    let startNode = split(start)
    if (startNode.nodeType !== window.Node.TEXT_NODE) {
      const iterator = document.createNodeIterator(
        startNode,
        window.NodeFilter.SHOW_TEXT
      )
      startNode = iterator.nextNode()
    }
    range.setStart(startNode, 0)
    let endNode = split(end - start)
    if (endNode.nodeType !== window.Node.TEXT_NODE) {
      const iterator = document.createNodeIterator(
        endNode,
        window.NodeFilter.SHOW_TEXT
      )
      endNode = iterator.nextNode()
    }
    range.setEnd(endNode, endNode.textContent.length)
    return range
  } else if (selector.type === 'RangeSelector') {
    const startXpath = selector.startSelector.value
    const startContainer = document.querySelector(`[data-location="${startXpath}"]`)
    const start = selector.endSelector.start
    const endXpath = selector.endSelector.value
    const endContainer = document.querySelector(`[data-location="${endXpath}"]`)
    const end = selector.endSelector.end
    const startIterator = document.createNodeIterator(
      startContainer,
      window.NodeFilter.SHOW_TEXT
    )
    const split = makeSplit(startIterator)
    const startNode = split(start)
    range.setStart(startNode, 0)
    const endIterator = document.createNodeIterator(
      endContainer,
      window.NodeFilter.SHOW_TEXT
    )
    const endSplit = makeSplit(endIterator)
    const endNode = endSplit(end)
    range.setEnd(endNode, 0)
    return range
  }
}

function makeNote (container, range) {
  const html = serializeRange(range)
  const content = `<blockquote>${html}</blockquote>`
  const chapter = container.closest('[data-component="reader"]')
  const inReplyTo = chapter.dataset.chapterId
  const context = chapter.dataset.bookId
  return {
    type: 'Note',
    inReplyTo,
    context,
    content
  }
}

function makeXPathSelector (container, range, note) {
  const text = range.toString()
  const start = container.textContent.indexOf(text)
  const end = text.length + start
  const xpath = container.dataset.location
  note['oa:hasSelector'] = {
    type: 'XPathSelector',
    value: xpath,
    start,
    end
  }
  console.log(note)
  return note
}

function makeRangeSelector (startElement, endElement, range, note) {
  const startRange = document.createRange()
  startRange.selectNodeContents(startElement)
  startRange.setStart(range.startContainer, range.startOffset)
  const startText = startRange.toString()
  const start = startElement.textContent.indexOf(startText)
  const endRange = document.createRange()
  endRange.selectNodeContents(endElement)
  endRange.setStart(range.endContainer, range.endOffset)
  const endText = endRange.toString()
  const end = endElement.textContent.indexOf(endText)
  note['oa:hasSelector'] = {
    type: 'RangeSelector',
    startSelector: {
      'type': 'XPathSelector',
      value: startElement.dataset.location,
      start
    },
    endSelector: {
      'type': 'XPathSelector',
      value: endElement.dataset.location,
      end
    }
  }
  console.log(note)
  return note
}

function serializeRange (range) {
  const placeholder = document.createElement('div')
  const fragment = range.cloneContents()
  fragment.querySelectorAll('[data-reader]').forEach(element => {
    element.parentElement.removeChild(element)
  })
  fragment.querySelectorAll('reader-highlight').forEach(element => {
    element.replaceWith(element.textContent)
  })
  placeholder.appendChild(fragment)
  return placeholder.innerHTML
}

function makeSplit (iterator) {
  return function split (where) {
    const count = seek(iterator, where)
    if (count !== where) {
      // Split the text at the offset
      iterator.referenceNode.splitText(where - count)

      // Seek to the exact offset.
      seek(iterator, where - count)
    }
    return iterator.referenceNode
  }
}
