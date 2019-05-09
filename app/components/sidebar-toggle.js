import wickedElements from 'wicked-elements'

wickedElements.define('[data-component="sidebar-toggle"]', {
  onconnected (event) {
    this.element = event.currentTarget
    this.element.addEventListener('click', this)
    this.sidebar = document.getElementById(this.element.dataset.sidebar)
    console.log(this.sidebar)
    this.app = this.element.closest('.App')
    this.app.addEventListener('app:sidebar-toggle', this)
    this.element.setAttribute('aria-expanded', 'true')
    // const width = document.body.clientWidth
    this.app.dataset.toggleLeft = 'show'
    this.app.dataset.toggleRight = 'hide'
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

function toggle (sidebar, button, app) {
  const left = app.dataset.toggleLeft
  const right = app.dataset.toggleRight
  const width = document.body.clientWidth
  console.log(sidebar)
  const visibility = sidebar.dataset.isVisible
  if (width <= 900) {
    sidebar.dataset.isVisible = visibility === 'true' ? 'false' : 'true'
    sendEvent({sidebar: sidebar.id, visibility: visibility === 'true' ? 'false' : 'true'})
  } else if (width > 900 && width < 1201 && sidebar.id === 'right-sidebar') {
    sidebar.dataset.isVisible = visibility === 'true' ? 'false' : 'true'
    sendEvent({sidebar: sidebar.id, visibility: visibility === 'true' ? 'false' : 'true'})
  } else {
    if (sidebar.id === 'left-sidebar') {
      app.dataset.toggleLeft = left === 'show' ? 'hide' : 'show'
      sendEvent({sidebar: sidebar.id, visibility: left === 'show' ? 'false' : 'true'})
    } else if (sidebar.id === 'right-sidebar') {
      console.log(sidebar, app, right)
      app.dataset.toggleRight = right === 'show' ? 'hide' : 'show'
      sendEvent({sidebar: sidebar.id, visibility: right === 'show' ? 'false' : 'true'})
    }
  }
}
function sendEvent (detail) {
  // document.getElementById('app').dispatchEvent(
  //   new window.CustomEvent('app:sidebar-toggle', {
  //     detail
  //   }))
}
