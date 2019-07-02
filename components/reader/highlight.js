import * as textQuote from 'dom-anchor-text-quote'
import { html } from 'lit-html'
import { virtual } from 'haunted'
import { api } from '../api-provider.component.js'

export const HighlightButton = virtual(
  ({ selectionRange, root }, document, bookId) => {
    let selector
    return html`<button style="z-index: 5;" type="button" class="Button" ?hidden=${!(
      selectionRange && root
    )} @click=${() => {
      if (selectionRange && root) {
        selector = textQuote.default.fromRange(root, selectionRange)
        const html = serializeRange(selectionRange)
        const content = `<blockquote data-original-quote>${html}</blockquote>`
        const docurl = new URL(document, window.location).href
        return api.activity
          .create({
            type: 'Note',
            noteType: 'reader:Highlight',
            inReplyTo: docurl,
            'oa:hasSelector': selector,
            content
          })
          .then(id => {
            highlightNote(selector, root, id)
            window
              .getSelection()
              .getRangeAt(0)
              .collapse()
          })
      }
    }}>Highlight</button>`
  }
)

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
}

export async function highlightNotes (root, notes) {
  for (const note of notes.items) {
    if (note.selector) {
      highlightNote(note.selector, root, note.id)
    }
  }
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

function serializeRange (range) {
  const placeholder = document.createElement('div')
  const fragment = range.cloneContents()
  fragment.querySelectorAll('[data-reader]').forEach(element => {
    element.parentElement.removeChild(element)
  })
  fragment.querySelectorAll('reader-highlight').forEach(element => {
    element.replaceWith(element.textContent)
  })
  fragment
    .querySelectorAll('[style]')
    .forEach(element => element.removeAttribute('style'))
  placeholder.appendChild(fragment)
  return placeholder.innerHTML
}
