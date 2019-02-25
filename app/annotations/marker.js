import wickedElements from 'wicked-elements'

wickedElements.define('.Marker-textarea', {
  onconnected (event) {
    this.el = event.currentTarget
    this.parent = this.el.closest('.Marker')
    this.el.addEventListener('change', this)
  },
  onchange (event) {
    this.parent.classList.add('Marker--hasContent')
  }
})

wickedElements.define('[is="marker-note"]', {
  init (event) {
    const element = (this.el = event.currentTarget)
    const container = this.el.querySelector('.MarkerNote-textarea')
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
    this.quill.on('selection-change', function (range, oldRange, source) {
      if (range) {
        onFocus(element)
      } else {
        onBlur(element)
      }
    })
    this.quill.on('text-change', function () {
      element.parentElement.classList.add('Marker--hasContent')
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
    element.classList.add('MarkerNote--hasFocus')
  },
  onblur (element) {
    element.classList.remove('MarkerNote--hasFocus')
  }
})

function marker (xpath) {
  const form = document.createElement('form')
  form.setAttribute('is', 'marker-note')
  form.dataset.for = xpath
  form.dataset.reader = 'true'
  form.classList.add('MarkerNote')
  form.id = 'MarkerNote-' + xpath
  const textareaId = 'MarkerNote-text-' + xpath
  form.dataset.newNote = 'true'
  form.innerHTML = `<div class="MarkerNote-textarea" id="${textareaId}" data-reader="true" aria-label="Sidebar note"></div>`
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
