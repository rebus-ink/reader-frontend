import { hook, Hook } from 'haunted'
// Very very loosely based on https://micromodal.now.sh, MIT Licensed

const modalMap = new Map()
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
  '[tabindex]:not([tabindex^="-"])'
]

export const useModal = hook(
  class extends Hook {
    constructor (id, el) {
      super(id, el)
      this.element = el.host
      modalMap.set(this.element.id, this)
      this.element.addEventListener('keydown', this)
      this.closer = this.closer.bind(this)
      this.opener = this.opener.bind(this)
    }
    update () {
      console.log('update called')
      return [this.closer, this.opener]
    }
    handleEvent (event) {
      if (event.type === 'keydown') {
        this.onKeydown(event)
      }
    }

    opener () {
      console.log('opener called')
      this.activeElement = document.activeElement
      this.element.setAttribute('aria-hidden', 'false')
      this.element.classList.add('is-open')
      this.setFocusToFirstNode()
      this.scrollBehaviour('disable')
    }
    closer () {
      console.log('closer called')
      const element = this.element
      element.setAttribute('aria-hidden', 'true')
      this.scrollBehaviour('enable')
      if (this.activeElement) {
        this.activeElement.focus()
      }
      element.classList.remove('is-open')
      element.open = false
    }
    onKeydown (event) {
      console.log('keydown called')
      if (event.keyCode === 27) this.closeModal(event)
      if (event.keyCode === 9) this.maintainFocus(event)
    }

    scrollBehaviour (toggle) {
      console.log('scrollbehaviour called')
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
      console.log('focusable called')
      let nodes
      if (this.element.shadowRoot) {
        nodes = this.element.shadowRoot.querySelectorAll(FOCUSABLE_ELEMENTS)
      } else {
        nodes = this.element.querySelectorAll(FOCUSABLE_ELEMENTS)
      }
      return Array(...nodes)
    }
    setFocusToFirstNode () {
      console.log('focus first called')
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
      console.log('maintain focus called')
      const focusableNodes = this.getFocusableNodes()

      // if disableFocus is true
      if (!this.contains(document.activeElement)) {
        focusableNodes[0].focus()
      } else {
        const focusedItemIndex = focusableNodes.indexOf(document.activeElement)

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
    }
  }
)
