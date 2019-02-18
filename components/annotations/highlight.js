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
    for (let index = 0; index < selection.rangeCount; index++) {
      const range = selection.getRangeAt(index)
      // Turn the range into an array of ranges that don't include UI elements
      const rangeString = range.toString()
      console.log(rangeString)
      highlightString(rangeString)
    }
    selection.collapseToStart()
  }
})

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
