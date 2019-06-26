import * as textQuote from 'dom-anchor-text-quote'
import { html, render } from 'lit-html'
import { virtual, useEffect, useState } from 'haunted'

export const HighlightButton = virtual(({ selectionRange, root }) => {
  let selector
  if (selectionRange && root) {
    selector = textQuote.default.fromRange(root, selectionRange)
  }
  return html`<button style="position: fixed; bottom: 0.25rem;z-index: 5;" type="button" class="Button" ?hidden=${!(
    selectionRange && root
  )} @click=${() =>
    highlightNote(
      selector,
      root,
      'id-' + Math.random() * 1000
    )}>Highlight</button>`
})

function highlightNote (selector, root, id) {
  const iterator = document.createNodeIterator(
    root,
    window.NodeFilter.SHOW_TEXT
  )
  const range = textQuote.default.toRange(root, selector)
  const start = range.startContainer
  const startOffset = range.startOffset
  const end = range.endContainer
  const endOffset = range.endOffset
  if (start === end && start.splitText) {
    const startNode = start.splitText(startOffset)
    startNode.splitText(endOffset - startOffset)
    range.setStart(startNode, 0)
    range.setEnd(startNode, startNode.length - 1)
  } else {
    console.log('We are in separate nodes', start, startOffset, end, endOffset)
    if (start && start.splitText && startOffset && startOffset !== 0) {
      const startNode = start.splitText(startOffset)
      range.setStart(startNode, 0)
    }
    if (end && end.splitText && endOffset && endOffset !== 0) {
      const endNode = end.splitText(endOffset)
      range.setEnd(endNode.previousSibling, endNode.previousSibling.length - 1)
    }
  }
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
      highlight.dataset.noteId = id
      highlight.classList.add('Highlight')

      // Wrap it around the text node
      node.parentNode.replaceChild(highlight, node)
      highlight.appendChild(node)
    }
  }
  window.getSelection().removeAllRanges()
}
