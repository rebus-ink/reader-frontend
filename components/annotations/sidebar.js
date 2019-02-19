const wickedElements = require('wicked-elements').default
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
