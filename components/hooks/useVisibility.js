import { hook, Hook } from 'haunted'

const config = {
  rootMargin: '0px 0px',
  threshold: 0.01
}
const positionObserver = new window.IntersectionObserver(onIntersection, config)
const hostToHook = new WeakMap()

function onIntersection (entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      hostToHook.get(entry.target).setVisibility(true, entry)
    } else {
      hostToHook.get(entry.target).setVisibility(false, entry)
    }
  })
}

export const useVisibility = hook(
  class extends Hook {
    constructor (id, el) {
      super(id, el)
      this.makeArgs(false)
    }
    makeArgs (visibility, entry = {}) {
      this.args = Object.freeze([visibility, entry])
    }
    update () {
      if (!hostToHook.get(this.el.host)) {
        hostToHook.set(this.el.host, this)
        positionObserver.observe(this.el.host)
      }
      return this.args
    }
    setVisibility (visible, entry) {
      this.el.host.visible = visible
      this.makeArgs(visible, entry)
      this.el.update()
    }
  }
)
