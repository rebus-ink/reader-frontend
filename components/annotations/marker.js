const wickedElements = require('wicked-elements').default
const { html } = require('lighterhtml')
const xpathObserver = new window.IntersectionObserver(onIntersection, {
  rootMargin: '50px 0px'
})

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
  const formId = 'marker-' + xpath
  const checkId = 'marker-check-' + xpath
  const button = html`<button class="NoteButton" is="note-button"><svg viewBox="0 0 10 10" fill="currentColor" stroke="transparent" width="20" height="20">
  <path d="m1 4h8v2h-8zm3-3h2v8h-2z"></path>
</svg></button>`
  element.appendChild(button)
  const marker = html`<form data-for-xpath="${xpath}" is="marker-input" class="MarkerInput">
  <input type="checkbox" class="MarkerInput-checkbox visuallyhidden" id="${checkId}">
  <label for="${checkId}" aria-label="Show sidebar note" class="MarkerInput-toggle">
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="m24 1h-24v17h4v5l7-5h13z"/></svg></label>
  <textarea id="${formId}" aria-label="Sidebar Note" class="MarkerInput-textarea" data-reader="true"></textarea></form>`
  element.appendChild(marker)
}

wickedElements.define('[data-xpath]', {
  init: function (event) {
    xpathObserver.observe(event.currentTarget)
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
