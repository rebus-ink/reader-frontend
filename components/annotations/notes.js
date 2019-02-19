const wickedElements = require('wicked-elements').default

wickedElements.define('[data-component="note-button"]', {
  init (event) {
    this.element = event.currentTarget.closest('[data-xpath]')
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
    const element = (this.el = event.currentTarget)
    const container = this.el.querySelector('.ReaderNote-textarea')
    this.quill = new window.Quill(container, {
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
    this.toolbar = this.el.querySelector('.ql-toolbar')
    const onFocus = this.onfocus
    const onBlur = this.onblur
    this.el.classList.remove('ReaderNote--preRendered')
    this.quill.on('selection-change', function (range, oldRange, source) {
      if (range) {
        onFocus(element)
      } else {
        onBlur(element)
      }
    })
    this.quill.on('text-change', function () {
      element.classList.add('ReaderNote--hasContent')
    })
    const button = document.createElement('button')
    button.textContent = 'Delete'
    button.classList.add('TextButton')
    button.classList.add('TextButton--noteDelete')
    button.addEventListener('click', event => {
      this.el.parentElement.removeChild(this.el)
    })
    button.dataset.noteDelete = 'true'
    this.el.appendChild(button)
  },
  onfocus (element) {
    element.classList.add('ReaderNote--hasFocus')
  },
  onblur (element) {
    element.classList.remove('ReaderNote--hasFocus')
  }
})

function note (element) {
  const xpath = element.dataset.xpath
  const form = document.createElement('form')
  form.dataset.component = 'reader-note'
  form.dataset.for = xpath
  form.dataset.reader = 'true'
  form.classList.add('ReaderNote')
  form.id = 'ReaderNote-' + xpath
  const textareaId = 'ReaderNote-text-' + xpath
  form.dataset.newNote = 'true'
  form.innerHTML = `<div class="ReaderNote-textarea" id="${textareaId}" data-reader="true" aria-label="Sidebar note"></div>`
  const button = document.createElement('button')
  button.textContent = 'Cancel'
  button.classList.add('TextButton')
  button.classList.add('TextButton--noteButton')
  button.addEventListener('click', event => {
    form.parentElement.removeChild(form)
  })
  button.dataset.noteCancel = 'true'
  form.appendChild(button)
  return form
}

function makeNoteId (element) {
  return 'ReaderNote-' + element.dataset.xpath
}
