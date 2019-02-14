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
      const container = newNote.querySelector('.ReaderNote-textarea')
      this.inkEditor = new window.Quill(container, {
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
      this.inkEditor.focus()
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

function note (xpath) {
  const noteId = makeNoteId(xpath)
  const textareaId = noteId + '-textarea'
  const note = document.createElement('div')
  note.classList.add('ReaderNote')
  note.id = noteId
  note.dataset.reader = 'true'
  note.innerHTML = `<div class="ReaderNote-textarea" id="${textareaId}" data-reader="true" aria-label="Note"></div>`
  return note
}

function makeNoteId (xpath) {
  return 'reader-note-' + xpath.dataset.xpath
}
