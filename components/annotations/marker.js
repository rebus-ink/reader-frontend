const wickedElements = require('wicked-elements').default
const { html } = require('lighterhtml')
const xpathObserver = new window.IntersectionObserver(onIntersection, {
  rootMargin: '50px 0px'
})
const positionObserver = new window.IntersectionObserver(onPosition, {
  threshold: 1,
  rootMargin: '0px 0px -50% 0px'
})

let highest
function onPosition (entries) {
  const nextHighest = entries.reduce((prev, current) => {
    if (
      current.intersectionRatio > prev.intersectionRatio &&
      current.intersectionRatio === 1
    ) {
      return current
    } else {
      return prev
    }
  })
  if (!highest) {
    highest = nextHighest
  } else if (nextHighest.intersectionRatio >= highest.intersectionRatio) {
    highest = nextHighest
  }
  document.getElementById('chapter').dataset.currentPosition =
    highest.target.dataset.xpath
}

function onIntersection (entries) {
  entries.forEach(entry => {
    if (entry.intersectionRatio > 0) {
      xpathObserver.unobserve(entry.target)
      addAnnotationTools(entry.target)
    }
  })
}

function addAnnotationTools (element) {
  const xpath = element.dataset.xpath
  // const formId = 'marker-' + xpath
  // const checkId = 'marker-check-' + xpath
  if (!element.querySelector('.NoteButton')) {
    const button = html`<button class="NoteButton" is="note-button" aria-label="Add note" data-for="${xpath}"><svg viewBox="0 0 10 10" fill="currentColor" stroke="transparent" width="15" height="15">
    <path d="m1 4h8v2h-8zm3-3h2v8h-2z"></path>
  </svg></button>`
    element.appendChild(button)
  }
  if (!element.querySelector('.Marker')) {
    const marker = html`<div class="Marker"><button class="NoteButton NoteButton--marker" is="marker-button" aria-label="Add marker" data-for="${xpath}"><svg viewBox="0 0 10 10" fill="currentColor" stroke="transparent" width="15" height="15">
    <path d="m1 4h8v2h-8zm3-3h2v8h-2z"></path>
  </svg></button></div>`
    element.appendChild(marker)
  }
}

wickedElements.define('[data-xpath]', {
  init: function (event) {
    xpathObserver.observe(event.currentTarget)
    positionObserver.observe(event.currentTarget)
  },
  onconnected (event) {
    // // add position attributes to marker
  },
  ondisconnected (event) {
    // remove drop down marker element from sidebar
  }
})

// From https://developer.mozilla.org/en-US/docs/Web/Events/resize
function throttle (type, name, obj) {
  obj = obj || window
  var running = false
  const func = function () {
    if (running) {
      return
    }
    running = true
    window.requestAnimationFrame(function () {
      obj.dispatchEvent(new window.CustomEvent(name))
      running = false
    })
  }
  obj.addEventListener(type, func)
}
throttle('resize', 'optimizedResize')

wickedElements.define('#sidebar', {
  onconnected (event) {
    this.element = event.currentTarget
    this.setSize()
    window.addEventListener('optimizedResize', this)
  },
  onoptimizedResize () {
    this.setSize()
  },
  setSize () {
    const size = this.element.offsetWidth
    document.body.style.setProperty('--sidebar-width', size + 'px')
    if (size < 200) {
      document.body.classList.add('Layout--reader-no-sidebar')
    } else {
      document.body.classList.remove('Layout--reader-no-sidebar')
    }
  }
})

wickedElements.define('[is="marker-input"]', {
  onconnected (event) {
    this.el = event.currentTarget
    this.textarea = event.currentTarget.querySelector('.Marker-textarea')
    this.textarea.addEventListener('focus', this)
    this.textarea.addEventListener('blur', this)
    this.textarea.addEventListener('paste', this)
    this.el.dataset.reader = true
  },
  onfocus (event) {
    this.el.classList.add('Marker--focused')
  },
  onblur (event) {
    this.el.classList.remove('Marker--focused')
    this.textarea.textContent = this.textarea.textContent
  }
})

wickedElements.define('[is="note-button"]', {
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

wickedElements.define('[is="reader-note"]', {
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
  form.setAttribute('is', 'reader-note')
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
