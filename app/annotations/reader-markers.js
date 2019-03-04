import wickedElements from 'wicked-elements'
import {html} from 'lighterhtml'
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
    annotationToolsObserver.observe(this.element)
    this.element.addEventListener('reader:markers-visible', this)
  },
  onconnected (event) {
    // // add position attributes to marker
  },
  ondisconnected (event) {
    // remove drop down marker element from sidebar
  },
  'onreader:markers-visible': function (event) {
    if (!this.element.classList.contains('Marker--hasContent')) {
      const tools = html`<textarea class="Marker-textarea" aria-label="Sidebar note"></textarea><button class="Marker-button"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="bevel"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg></button>`
      this.element.appendChild(tools)
    }
    const parent = this.element.closest('[data-location]')
    const noteButton = html`<button class="NoteButton" data-component="note-button" aria-label="Add note" data-for="${parent.dataset.location}"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="bevel"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg></button>`
    parent.appendChild(noteButton)
    this.element.classList.add('Marker--visible')
  }
})
