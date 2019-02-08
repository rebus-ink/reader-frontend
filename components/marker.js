const wickedElements = window.wickedElements
const { html } = window.lighterhtml

wickedElements.define('[data-xpath]', {
  init: function (event) {
    this.el = event.currentTarget
    const xpath = this.el.dataset.xpath
    const formId = 'marker-' + xpath
    const button = html`<button class="NoteButton" is="note-button"><svg viewBox="0 0 10 10" fill="currentColor" stroke="transparent" width="20" height="20">
    <path d="m1 4h8v2h-8zm3-3h2v8h-2z"></path>
  </svg></button>`
    this.el.appendChild(button)
    const marker = html`<form data-for-xpath="${xpath}" is="marker-input" class="MarkerInput"><textarea id="${formId}" class="MarkerInput-textarea" data-reader="true" aria-label="Sidebar Note"></textarea></form>`
    this.el.appendChild(marker)
    // Find dropdown marker element in sidebar
  },
  onconnected (event) {
    // // add position attributes to marker
  },
  ondisconnected (event) {
    // remove drop down marker element from sidebar
  }
})

wickedElements.define('#sidebar', {
  onconnected (event) {
    const element = event.currentTarget
    document.body.style.setProperty(
      '--sidebar-width',
      element.offsetWidth + 'px'
    )
  }
})

wickedElements.define('[is="marker-input"]', {
  onconnected (event) {
    this.el = event.currentTarget
    this.textarea = event.currentTarget.querySelector('.MarkerInput-textarea')
    this.textarea.addEventListener('focus', this)
    this.textarea.addEventListener('blur', this)
    this.textarea.addEventListener('paste', this)
    this.el.dataset.reader = true
  },
  onfocus (event) {
    this.el.classList.add('MarkerInput--focused')
  },
  onblur (event) {
    this.el.classList.remove('MarkerInput--focused')
    this.textarea.textContent = this.textarea.textContent
  }
})

wickedElements.define('[is="note-button"]', {
  onconnected (event) {
    this.xpath = event.currentTarget.closest('[data-xpath]')
    event.currentTarget.addEventListener('click', this)
    event.currentTarget.dataset.reader = true
  },
  onclick (event) {
    const { xpath } = this
    const noteElement = document.getElementById(makeNoteId(xpath))
    if (noteElement) {
      noteElement.querySelector('.ReaderNote-textarea').focus()
    } else {
      const newNote = note(xpath)
      xpath.parentElement.insertBefore(newNote, xpath.nextSibling)
      newNote.querySelector('.ReaderNote-textarea').focus()
    }
  }
})

wickedElements.define('.MarkerInput-textarea', {
  onconnected (event) {
    this.el = event.currentTarget
    this.parent = this.el.closest('.MarkerInput')
    this.el.addEventListener('change', this)
  },
  onchange (event) {
    this.parent.classList.add('MarkerInput--hasContent')
  }
})

function note (xpath) {
  const noteId = makeNoteId(xpath)
  const textareaId = noteId + '-textarea'
  return html`<div class="ReaderNote" id="${noteId}" data-reader="true">
    <textarea class="ReaderNote-textarea" id="${textareaId}" data-reader="true" aria-label="Note"></textarea>
  </div>`
}

function makeNoteId (xpath) {
  return 'reader-note-' + xpath.dataset.xpath
}
