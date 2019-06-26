import * as textQuote from 'dom-anchor-text-quote'
import { html } from 'lit-html'
import { virtual } from 'haunted'

export const HighlightButton = virtual(({ selectionRange, root }) => {
  let selector
  return html`<button style="z-index: 5;" type="button" class="Button" ?hidden=${!(
    selectionRange && root
  )} @click=${() => {
    if (selectionRange && root) {
      selector = textQuote.default.fromRange(root, selectionRange)
      highlightNote(selector, root, 'id-' + Math.random() * 1000)
    }
  }}>Highlight</button>`
})

export const RemoveHighlightButton = virtual(({ noteId, root }) => {
  return html`<button style="z-index: 5;background-color: var(--error); color: white;" type="button" class="Button" ?hidden=${!(
    noteId && root
  )} @click=${() => {
    if (noteId && root) {
      root
        .querySelectorAll(`reader-highlight[data-note-id="${noteId}"]`)
        .forEach(highlight => highlight.replaceWith(...highlight.childNodes))
      const customEvent = new window.CustomEvent(
        'reader:highlight-deselected',
        {
          detail: { id: noteId }
        }
      )
      window.dispatchEvent(customEvent)
    }
  }}>Remove Highlight</button>`
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
  window
    .getSelection()
    .getRangeAt(0)
    .collapse()
}

class ReaderHighlight extends window.HTMLElement {
  connectedCallback () {
    this.addEventListener('click', this)
    window.addEventListener('reader:highlight-selected', this)
    window.addEventListener('reader:highlight-deselected', this)
  }
  handleEvent (event) {
    if (
      event.type === 'click' &&
      !this.classList.contains('Highlight--selected')
    ) {
      const customEvent = new window.CustomEvent('reader:highlight-selected', {
        detail: { id: this.dataset.noteId }
      })
      window.dispatchEvent(customEvent)
    } else if (
      event.type === 'click' &&
      this.classList.contains('Highlight--selected')
    ) {
      const customEvent = new window.CustomEvent(
        'reader:highlight-deselected',
        {
          detail: { id: this.dataset.noteId }
        }
      )
      window.dispatchEvent(customEvent)
    } else if (
      event.type === 'reader:highlight-selected' &&
      event.detail.id === this.dataset.noteId
    ) {
      this.classList.add('Highlight--selected')
    } else if (
      event.type === 'reader:highlight-deselected' &&
      event.detail.id === this.dataset.noteId
    ) {
      this.classList.remove('Highlight--selected')
    }
  }
  disconnectedCallback () {
    this.removeEventListener('click', this)
    this.removeEventListener('reader:highlight-selected', this)
  }
}
window.customElements.define('reader-highlight', ReaderHighlight)
