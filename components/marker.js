const wickedElements = window.wickedElements
const { html } = window.lighterhtml

wickedElements.define('[data-xpath]', {
  init: function (event) {
    this.el = event.currentTarget
    const xpath = this.el.dataset.xpath
    const formId = 'marker-' + xpath
    const button = html`<button class="NoteButton" is="note-button">+</button>`
    this.el.appendChild(button)
    const marker = html`<form data-for-xpath="${xpath}" is="marker-input" class="MarkerInput"><label class="visuallyhidden" for="${formId}">Sidebar Note</label><textarea id="${formId}" class="MarkerInput-textarea"></textarea></form>`
    this.el.appendChild(marker)
    // Find dropdown marker element in sidebar
  },
  onconnected (event) {
    console.log(this.marker)
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
    console.log(element, element.offsetWidth)
  }
})

wickedElements.define('[is="marker-input"]', {
  onconnected (event) {
    this.el = event.currentTarget
    this.textarea = event.currentTarget.querySelector('.MarkerInput-textarea')
    this.textarea.addEventListener('focus', this)
    this.textarea.addEventListener('blur', this)
    this.textarea.addEventListener('paste', this)
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

function note (xpath) {
  const noteId = makeNoteId(xpath)
  const textareaId = noteId + '-textarea'
  return html`<div class="ReaderNote" id="${noteId}">
    <label for="${textareaId}" class="visuallyhidden">Note</label>
    <textarea class="ReaderNote-textarea" id="${textareaId}"></textarea>
  </div>`
}

function makeNoteId (xpath) {
  return 'reader-note-' + xpath.dataset.xpath
}
