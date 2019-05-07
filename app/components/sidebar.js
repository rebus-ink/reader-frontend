import wickedElements from 'wicked-elements'
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

wickedElements.define('[data-sidebar]', {
  onconnected (event) {
    this.element = event.currentTarget
    this.setSize()
    window.addEventListener('optimizedResize', this)
  },
  get root () {
    return document.querySelector(this.element.dataset.root)
  },
  onoptimizedResize () {
    this.setSize()
  },
  setSize () {
    const size = this.element.offsetWidth
    if (!this.root) return
    this.root.style.setProperty(`--${this.element.id}-width`, size + 'px')
    if (size < 120) {
      this.root.classList.add('hide-' + this.element.id)
      this.root.classList.remove('show-' + this.element.id)
    } else {
      this.root.classList.add('show-' + this.element.id)
      this.root.classList.remove('hide-' + this.element.id)
    }
  }
})
