import { hook, Hook } from 'haunted'
import Popper from '../../js/vendor/popper.js'
// Very very loosely based on https://micromodal.now.sh, MIT Licensed

const FOCUSABLE_ELEMENTS = [
  'a[href]',
  'area[href]',
  'input:not([disabled]):not([type="hidden"]):not([aria-hidden])',
  'select:not([disabled]):not([aria-hidden])',
  'textarea:not([disabled]):not([aria-hidden])',
  'button:not([disabled]):not([aria-hidden])',
  'iframe',
  'object',
  'embed',
  '[contenteditable]',
  '[tabindex]:not([tabindex^="-"])',
  'ink-modal-closer',
  'ink-button',
  'ink-dropdown',
  'icon-button'
]

function once (emitter, eventName) {
  return new Promise(resolve => {
    function listener (event) {
      resolve(event)
    }
    emitter.addEventListener(eventName, listener, { once: true })
  })
}

let activeModal

export const useModal = hook(
  class extends Hook {
    constructor (id, el) {
      super(id, el)
      this.element = el.host
      this.element.addEventListener('keydown', this)
      this.element.addEventListener('click', this)
      this.element.setAttribute('aria-hidden', 'true')
      this.closer = this.closer.bind(this)
      this.opener = this.opener.bind(this)
      this.args = Object.freeze([this.opener, this.closer])
    }
    update (config = {}) {
      this.config = config
      return this.args
    }
    handleEvent (event) {
      if (event.type === 'keydown') {
        this.onKeydown(event)
      } else if (event.type === 'click') {
        this.onClick(event)
      }
    }
    onKeydown (event) {
      if (event.keyCode === 27) this.closeModal(event)
      if (event.keyCode === 9) this.maintainFocus(event)
    }
    onClick (event) {
      if (testClicker(event.composedPath())) {
        this.closer()
        event.preventDefault()
      }
    }

    async opener (ref) {
      const container = this.element.shadowRoot.querySelector('[role="dialog"]')
      let reference
      if (ref) {
        if (ref.current) {
          reference = ref.current
        } else {
          reference = ref
        }
      }
      await close()
      if (reference) {
        this.popper = new Popper(reference, container, {
          positionFixed: true,
          arrow: { enabled: true }
        })
      }
      this.activeElement = document.activeElement
      this.scrollBehaviour('disable')
      const element = this.element
      this.element.setAttribute('aria-hidden', 'false')
      if (this.config.animation) {
        const container = element.shadowRoot.querySelector('.container')
        container.classList.add('is-opening')
        await once(container, 'animationend')
        container.classList.remove('is-opening')
      }
      this.element.classList.add('is-open')
      this.setFocusToFirstNode()
      activeModal = this
    }
    async closer () {
      const element = this.element
      if (this.config.animation) {
        const container = element.shadowRoot.querySelector('.container')
        container.classList.add('is-closing')
        await once(container, 'animationend')
        container.classList.remove('is-closing')
      }
      element.setAttribute('aria-hidden', 'true')
      this.scrollBehaviour('enable')
      if (this.activeElement) {
        this.activeElement.focus()
      }
      element.classList.remove('is-open')
      element.open = false
      element.reference = null
      activeModal = null
    }

    scrollBehaviour (toggle) {
      const body = document.querySelector('body')
      switch (toggle) {
        case 'enable':
          Object.assign(body.style, { overflow: '', height: '' })
          break
        case 'disable':
          Object.assign(body.style, { overflow: 'hidden', height: '100vh' })
          break
        default:
      }
    }

    getFocusableNodes () {
      let nodes = []
      if (this.element.shadowRoot) {
        nodes = nodes.concat(
          Array.from(
            this.element.shadowRoot.querySelectorAll(FOCUSABLE_ELEMENTS)
          )
        )
      }
      nodes = nodes.concat(
        Array.from(this.element.querySelectorAll(FOCUSABLE_ELEMENTS))
      )
      return nodes
    }
    setFocusToFirstNode () {
      const focusableNodes = this.getFocusableNodes()
      if (focusableNodes.length) focusableNodes[0].focus()
    }

    contains (element) {
      if (this.element.shadowRoot) {
        return this.element.shadowRoot.contains(element)
      } else {
        return this.element.contains(element)
      }
    }
    maintainFocus (event) {
      const focusableNodes = this.getFocusableNodes()
      // if disableFocus is true
      const element = this.element
      const focusedItemIndex = focusableNodes.indexOf(
        element.shadowRoot.activeElement || document.activeElement
      )
      if (focusedItemIndex === -1) {
        focusableNodes[0].focus()
        event.preventDefault()
      } else {
        if (event.shiftKey && focusedItemIndex === 0) {
          focusableNodes[focusableNodes.length - 1].focus()
          event.preventDefault()
        }

        if (!event.shiftKey && focusedItemIndex === focusableNodes.length - 1) {
          focusableNodes[0].focus()
          event.preventDefault()
        }
      }
    }

    teardown () {
      this.element.removeEventListener('keydown', this)
      this.element.removeEventListener('click', this)
    }
  }
)

export function close () {
  if (activeModal) activeModal.closer()
}

function testClicker (path = []) {
  if (path[0]) {
    let clicker = path[0].closest(
      'button[data-modal-close],a[data-modal-close]'
    )
    if (!clicker) {
      clicker = path[0]
    }
    return clicker.hasAttribute('data-modal-close')
  } else {
    return false
  }
}
