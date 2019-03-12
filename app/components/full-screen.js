import wickedElements from 'wicked-elements'
import {render, html} from 'lighterhtml'

wickedElements.define('[data-component="full-screen"]', {
  init: function (event) {
    this.element = event.currentTarget
  },
  onconnected (event) {
    this.element.addEventListener('click', this)
    this.body = document.getElementById('layout')
    if (!document.fullscreenEnabled) {
      this.element.disabled = true
    }
    document.addEventListener('fullscreenchange', this)
    this.render()
  },
  ondisconnected (event) {
    this.element.removeEventListener('click', this)
  },
  onclick (event) {
    if (document.fullscreenElement) {
      return document.exitFullscreen()
    } else if (document.fullscreenEnabled) {
      return this.body.requestFullscreen()
    }
  },
  onfullscreenchange (event) {
    this.render()
  },
  render () {
    if (!document.fullscreenElement) {
      render(this.element, () => html`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path></svg>`)
    } else {
      render(this.element, () => html`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="round"><path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"></path></svg>`)
    }
  }
})
