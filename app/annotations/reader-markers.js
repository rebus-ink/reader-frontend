import wickedElements from 'wicked-elements'
import {render, html} from 'lighterhtml'
import * as activities from '../state/activities.js'

const annotationToolsObserver = new window.IntersectionObserver(onIntersection, {
  rootMargin: '50px 0px'
})

function onIntersection (entries) {
  entries.forEach(entry => {
    if (entry.intersectionRatio > 0) {
      annotationToolsObserver.unobserve(entry.target)
      entry.target.dispatchEvent(
        new window.CustomEvent('reader:markers-visible')
      )
    }
  })
}

wickedElements.define('reader-markers', {
  init: function (event) {
    this.element = event.currentTarget
  },
  onconnected (event) {
    annotationToolsObserver.observe(this.element)
    this.element.addEventListener('reader:markers-visible', this)
    if (this.element.dataset.noteId) {
      this.state = activities.note(this.element.dataset.noteId)
      this.render()
    }
  },
  ondisconnected (event) {
    // remove drop down marker element from sidebar
  },
  'onreader:markers-visible': function (event) {
    if (!this.element.classList.contains('Marker--hasContent')) {
      const tools = html`<textarea onchange="${this}" class="Marker-textarea" aria-label="Sidebar note"></textarea><button class="Marker-button"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="bevel"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg></button>`
      this.element.appendChild(tools)
    }
    const parent = this.element.closest('[data-location]')
    const noteButton = html`<button class="NoteButton" data-component="note-button" aria-label="Add note" data-for="${parent.dataset.location}"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="bevel"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg></button>`
    parent.appendChild(noteButton)
    this.element.classList.add('Marker--visible')
  },
  onchange (event) {
    const element = this.element
    element.classList.add('Marker--hasContent')
    const xpath = element.dataset.for
    const chapter = element.closest('[data-component="reader"]')
    const inReplyTo = chapter.dataset.chapterId
    const context = chapter.dataset.bookId
    const summary = element.querySelector('.Marker-textarea').value
    // if no id, create note
    const payload = {
      type: 'Note',
      'oa:hasSelector': {
        type: 'XPathSelector',
        value: xpath
      },
      inReplyTo,
      context,
      summary
    }
    if (!this.element.dataset.noteId && summary.length > 0) {
      return activities.createAndGetId(payload).then(id => {
        element.dataset.noteId = id
      })
    } else if (this.element.dataset.noteId && summary.length > 0 && this.state) {
      // if we have an id, compare with old and if necessary update note
      payload.id = this.element.dataset.noteId
      if (this.state.summary !== summary) {
        return activities.update(payload)
      }
    } else if (this.element.dataset.noteId && summary.length === 0) {
      payload.id = this.element.dataset.noteId
      // no text, delete note
      return activities.deleteActivity(payload).then(() => element.classList.remove('Marker--hasContent'))
    }
  },
  onattributechanged (event) {
    const {attributeName, oldValue, newValue} = event
    if (attributeName === 'data-note-id') {
      if (oldValue === newValue) { return }
      this.state = activities.note(newValue)
    } else {
    }
  },
  render () {
    if (this.state) {
      render(this.element, () => view(this.state))
      this.element.classList.add('Marker--hasContent')
    }
  },
  view (state) {
  },
  attributeFilter: ['data-note-id']
})

function view (state) {
  return html`<textarea  onchange="${this}" class="Marker-textarea" aria-label="Sidebar note">${state.summary}</textarea><button class="Marker-button"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="bevel"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg></button>`
}
