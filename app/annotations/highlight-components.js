import wickedElements from 'wicked-elements'
import * as activities from '../state/activities.js'
import {rangeToNote, highlightNote} from './highlight-actions.js'

wickedElements.define('reader-highlight', {
  onconnected (event) {
    this.element = event.currentTarget
    this.el.addEventListener('click', this)
  },
  onclick (event) {
    const noteId = this.element.dataset.noteId
    const selected = this.element.classList.contains('Highlight--selected')
    if (noteId && !selected) {
      document
        .querySelectorAll(`[data-note-id="${noteId}"]`)
        .forEach(element => element.classList.add('Highlight--selected'))
      document.body.dispatchEvent(
        new window.CustomEvent('reader:highlight-selected', {
          detail: { noteId }
        })
      )
    } else if (selected) {
      document
        .querySelectorAll(`[data-note-id="${noteId}"]`)
        .forEach(element => element.classList.remove('Highlight--selected'))
      document.body.dispatchEvent(
        new window.CustomEvent('reader:highlight-deselected', {
          detail: { noteId }
        })
      )
    }
  }
})

wickedElements.define('[is="remove-highlight-button"]', {
  onconnected (event) {
    this.element = event.currentTarget
    this.element.addEventListener('click', this)
    document.body.addEventListener('reader:highlight-selected', this)
    document.body.addEventListener('reader:highlight-deselected', this)
    this.element.disabled = true
  },
  async onclick (event) {
    await activities.deleteActivity({type: 'Note', id: this.element.dataset.noteId})
    document
      .querySelectorAll(
        `reader-highlight[data-note-id="${this.element.dataset.noteId}"]`
      )
      .forEach(element => {
        const range = document.createRange()
        range.setStartBefore(element.firstChild)
        range.setEndAfter(element.lastChild)
        const fragment = range.extractContents()
        element.parentElement.replaceChild(fragment, element)
      })
    this.element.blur()
    this.element.disabled = true
  },
  'onreader:highlight-selected': function (event) {
    console.log(event)
    this.element.disabled = false
    this.element.dataset.noteId = event.detail.noteId
  },
  'onreader:highlight-deselected': function (event) {
    console.log(event)
    this.element.disabled = true
    this.element.dataset.noteId = null
  }
})

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
    if (range.startContainer.parentElement.closest('[data-reader]')) {
      return null
    }
    const note = rangeToNote(range)
    this.save(note)
    // Clean up
    selection.collapseToStart()
  },
  save (payload, rangeId) {
    return activities.createAndGetId(payload).then(id => {
      payload.id = id
      highlightNote(payload)
    })
  }
})
