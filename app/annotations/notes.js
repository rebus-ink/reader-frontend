import wickedElements from 'wicked-elements'
import {render, html} from 'lighterhtml'
import Quill from 'quill'
import * as activities from '../state/activities.js'
import DOMPurify from 'dompurify'

const purifyConfig = {
  KEEP_CONTENT: false,
  RETURN_DOM_FRAGMENT: true,
  RETURN_DOM_IMPORT: true,
  FORBID_TAGS: ['style', 'link'],
  FORBID_ATTR: ['style']
}

const undoContent = new Map()

wickedElements.define('[data-component="note-button"]', {
  init (event) {
    this.element = event.currentTarget.closest('[data-location]')
    event.currentTarget.addEventListener('click', this)
    event.currentTarget.dataset.reader = true
  },
  onclick (event) {
    const { element } = this
    const noteElement = document.getElementById(makeNoteId(element))
    if (noteElement) {
      noteElement.querySelector('.ql-editor').focus()
    } else {
      const newNote = note(element)
      element.parentElement.insertBefore(newNote, element.nextSibling)
      window.requestAnimationFrame(function () {
        newNote.querySelector('.ql-editor').focus()
      })
    }
  }
})

wickedElements.define('[data-component="reader-note"]', {
  init (event) {
    this.element = event.currentTarget
    if (this.noteId) {
      this.state = activities.note(this.noteId)
    }
    this.render()
  },
  get id () {
    return this.element.id
  },
  get toolbar () {
    return this.element.querySelector('.ql-toolbar')
  },
  get noteId () {
    return this.element.dataset.noteId
  },
  set noteId (value) {
    this.element.dataset.noteId = value
  },
  get saved () {
    return this.element.dataset.saved
  },
  set saved (value) {
    this.element.dataset.saved = value
  },
  onclick (event) {
    const button = event.currentTarget
    if (button.dataset.noteDelete) {
      this.remove(event)
    }
  },
  onconnected () {
    const element = this.element
    const container = this.element.querySelector('.ReaderNote-textarea')
    this.quill = new Quill(container, {
      modules: {
        toolbar: [
          ['bold', 'italic', 'underline'],
          ['image', 'code-block'],
          ['link', 'blockquote'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['clean']
        ]
      },
      theme: 'snow'
    })
    this.element.classList.remove('ReaderNote--preRendered')
    this.quill.on('selection-change', (range, oldRange, source) => {
      if (range) {
        this.onfocus(element)
      } else {
        this.onblur(element)
      }
    })
    this.quill.on('text-change', () => {
      element.classList.add('ReaderNote--hasContent')
      this.saved = 'false'
    })
  },
  render () {
    render(this.element, () => this.view())
  },
  view () {
    const state = this.state
    let deleteText
    if (state && state.id) {
      deleteText = 'Delete'
    } else {
      deleteText = 'Cancel'
    }
    const xpath = this.element.dataset.for
    let content
    if (state && state.content) {
      content = state.content
    } else if (undoContent.get(xpath)) {
      content = undoContent.get(xpath)
    }
    let dom = DOMPurify.sanitize(content, purifyConfig)
    return html`<div class="ReaderNote-textarea ql-container ql-snow" id="${this.id + '-textarea'}" data-reader="true" aria-label="Note">${[dom]}</div><button class="TextButton TextButton--noteDelete" data-note-delete="true" onclick="${this}">${deleteText}</button>`
  },
  onfocus (element) {
    element.classList.add('ReaderNote--hasFocus')
  },
  remove (event) {
    if (this.noteId) {
      const xpath = this.element.dataset.for
      const element = this.element
      const payload = {
        type: 'Note',
        id: this.noteId
      }
      undoContent.set(xpath, this.element.querySelector('.ql-editor').innerHTML)
      // Find nearest note button, save content to button
      return activities.deleteActivity(payload).then(() => element.parentElement.removeChild(element))
    } else {
      this.element.parentElement.removeChild(this.element)
    }
  },
  onblur () {
    const element = this.element
    const xpath = element.dataset.for
    const content = element.querySelector('.ql-editor').innerHTML
    const chapter = element.closest('[data-component="reader"]')
    const inReplyTo = chapter.dataset.chapterId
    const context = chapter.dataset.bookId
    element.classList.remove('ReaderNote--hasFocus')
    const payload = {
      type: 'Note',
      'oa:hasSelector': {
        type: 'XPathSelector',
        value: xpath
      },
      inReplyTo,
      context,
      content
    }
    // Create note
    if (!this.noteId && content !== '<p><br></p>' && content.length > 0) {
      return activities.createAndGetId(payload).then(id => {
        this.noteId = id
        this.element.querySelector('[data-note-delete]').textContent = 'Delete'
      })
    // Or update it
    } else if (this.noteId && content.length > 0 && this.state) {
      // if we have an id, compare with old and if necessary update note
      payload.id = this.noteId
      if (this.state.content !== content) {
        return activities.update(payload)
      }
    }
    element.dataset.saved = 'true'
  }
})

function note (element) {
  const xpath = element.dataset.location
  const div = document.createElement('div')
  div.dataset.component = 'reader-note'
  div.dataset.for = xpath
  div.dataset.reader = 'true'
  div.classList.add('ReaderNote')
  div.id = 'ReaderNote-' + xpath
  div.dataset.newNote = 'true'
  return div
}

function makeNoteId (element) {
  return 'ReaderNote-' + element.dataset.location
}
