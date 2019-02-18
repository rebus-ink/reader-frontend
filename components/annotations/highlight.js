const wickedElements = require('wicked-elements').default
const seek = require('dom-seek')

wickedElements.define('[is="highlight-button"]', {
  onconnected (event) {
    this.el = event.currentTarget
    this.el.addEventListener('click', this)
  },
  onclick (event) {
    const selection = window.getSelection()
    if (selection.isCollapsed) return null
    let range
    if (selection.rangeCount > 1) {
      const endRange = selection.getRangeAt(selection.rangeCount - 1)
      range = selection.getRangeAt(0)
      range.setEnd(endRange.endContainer, endRange.endOffset)
    } else {
      range = selection.getRangeAt(0)
    }
    const texts = getTexts(range)
    texts.forEach(rangeString => highlightString(rangeString))
    console.log(texts)
    selection.collapseToStart()
  }
})

function getTexts (range) {
  const end = range.endContainer
  const start = range.startContainer
  const iterator = document.createNodeIterator(
    document.getElementById('chapter'),
    window.NodeFilter.SHOW_ALL
  )
  while (iterator.referenceNode !== start) {
    iterator.nextNode()
  }
  const ranges = []
  let newRange = document.createRange()
  newRange.setStart(range.startContainer, range.startOffset)
  while (iterator.referenceNode !== end) {
    const ref = iterator.referenceNode
    if (newRange && ref.matches && ref.matches('[data-reader]')) {
      newRange.setEndBefore(ref)
      ranges.push(newRange)
      newRange = undefined
      iterator.nextNode()
    } else if (ref.parentElement.closest('[data-reader]')) {
      iterator.nextNode()
    } else if (!newRange) {
      newRange = document.createRange()
      newRange.setStartBefore(ref)
      iterator.nextNode()
    } else {
      iterator.nextNode()
    }
  }
  if (newRange) {
    newRange.setEnd(end, range.endOffset)
    ranges.push(newRange)
  }
  const texts = ranges.map(range => range.toString())
  return texts
}

function highlightString (text) {
  const offset = document.body.textContent.indexOf(text)
  const length = text.length
  const iterator = document.createNodeIterator(
    document.body,
    window.NodeFilter.SHOW_TEXT
  )
  function split (where) {
    const count = seek(iterator, where)
    if (count !== where) {
      // Split the text at the offset
      iterator.referenceNode.splitText(where - count)

      // Seek to the exact offset.
      seek(iterator, where - count)
    }
    return iterator.referenceNode
  }
  split(offset)
  const end = split(length)
  const nodeCollector = document.createNodeIterator(
    document.body,
    window.NodeFilter.SHOW_TEXT
  )
  seek(nodeCollector, offset)
  var nodes = []
  while (nodeCollector.referenceNode !== end) {
    nodes.push(nodeCollector.nextNode())
  }
  // nodes = nodes.filter((node) => !node.parentElement.matches('[data-reader]'))
  for (var i = 0; i < nodes.length; i++) {
    const node = nodes[i]
    if (!node.parentElement.closest('[data-reader]')) {
      // Create a highlight
      const highlight = document.createElement('reader-highlight')
      highlight.dataset.reader = true

      // Wrap it around the text node
      node.parentNode.replaceChild(highlight, node)
      highlight.appendChild(node)
    }
  }
}

window.highlightString = highlightString
// Get range
// Split text node at end and start.
// Iterate to start
// iterate through range, building fresh sub ranges that don't include ui elements
// Turn arrays of ranges into flat array of strings.
// Call highlightString on each string in array.
// Highlight string root should be main/chapter
