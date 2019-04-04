import wickedElements from 'wicked-elements'
import {transition, rafPromise} from '../utils/transition.js'

wickedElements.define('[data-component="sidebar-toggle"]', {
  onconnected (event) {
    this.element = event.currentTarget
    this.element.addEventListener('click', this)
    this.sidebar = document.getElementById(this.element.dataset.sidebar)
    this.app = document.getElementById('app')
    this.app.addEventListener('app:sidebar-toggle', this)
    this.element.setAttribute('aria-expanded', 'true')
    // const width = document.body.clientWidth
    this.app.dataset.toggleLeft = 'show'
    this.app.dataset.toggleRight = 'show'
    // if (width <= 900) {
    //   this.sidebar.dataset.isVisible = 'false'
    // } else if (width > 900 && width < 1201 && this.sidebar.id === 'right-sidebar') {
    //   this.sidebar.dataset.isVisible = 'false'
    // } else if (width > 1200) {
    //   this.sidebar.dataset.isVisible = 'true'
    // }
  },
  'onapp:sidebar-toggle': function (event) {
    const {sidebar, visibility} = event.detail
    if (sidebar === this.element.dataset.sidebar) {
      this.element.setAttribute('aria-expanded', visibility)
    }
  },
  onclick (event) {
    toggle(this.sidebar, this.element, this.app)
  }
})

async function toggle (sidebar, button, app) {
  const left = app.dataset.toggleLeft
  const right = app.dataset.toggleRight
  const width = document.body.clientWidth
  const visibility = sidebar.dataset.isVisible
  if (width <= 900) {
    sidebar.dataset.isVisible = visibility === 'true' ? 'false' : 'true'
    sendEvent({sidebar: sidebar.id, visibility: visibility === 'true' ? 'false' : 'true'})
  } else if (width > 900 && width < 1201 && sidebar.id === 'right-sidebar') {
    sidebar.dataset.isVisible = visibility === 'true' ? 'false' : 'true'
    sendEvent({sidebar: sidebar.id, visibility: visibility === 'true' ? 'false' : 'true'})
  } else {
    if (sidebar.id === 'left-sidebar') {
      if (left === 'show') await transition(`#left-sidebar > *`, {transform: 'translateX(-100%)', opacity: 0}, 250)
      app.dataset.toggleLeft = left === 'show' ? 'hide' : 'show'
      sendEvent({sidebar: sidebar.id, visibility: left === 'show' ? 'false' : 'true'})
      await rafPromise()
      if (left !== 'show') await transition(`#left-sidebar > *`, {transform: 'translateX(0)', opacity: 1}, 250)
    } else if (sidebar.id === 'right-sidebar') {
      if (right === 'show') await transition(`#right-sidebar > *`, {transform: 'translateX(100%)', opacity: 0}, 250)
      app.dataset.toggleRight = right === 'show' ? 'hide' : 'show'
      sendEvent({sidebar: sidebar.id, visibility: right === 'show' ? 'false' : 'true'})
      if (right !== 'show') await transition(`#right-sidebar > *`, {transform: 'translateX(0)', opacity: 1}, 250)
    }
  }
}
function sendEvent (detail) {
  document.getElementById('app').dispatchEvent(
    new window.CustomEvent('app:sidebar-toggle', {
      detail
    }))
}
