import { createElement, wrapClass } from './create-element.js'
import { html } from 'lit-html'
import Popper from '../../js/vendor/popper.js'

const FOCUSABLE_ELEMENTS =
  'button:not([hidden]):not([disabled]), [href]:not([hidden]), input:not([hidden]):not([type="hidden"]):not([disabled]), select:not([hidden]):not([disabled]), textarea:not([hidden]):not([disabled]), [tabindex="0"]:not([hidden]):not([disabled]), summary:not([hidden]), [contenteditable]:not([hidden]), audio[controls]:not([hidden]), video[controls]:not([hidden])'

function once (emitter, eventName) {
  return new Promise(resolve => {
    function listener (event) {
      resolve(event)
    }
    emitter.addEventListener(eventName, listener, { once: true })
  })
}

let activeModal

const modalStyles = `
.what-a-modal {
  --arrow-size: 10px;
}
.what-a-modal[aria-hidden='true'] {
  visibility: hidden;
  position: absolute;
  pointer-events: none;
}
.what-a-container .popper__arrow {
  width: 0;
  height: 0;
  border-style: solid;
  position: absolute;
  margin: 10px;
  border-color: white;
}
.what-a-container .popper__arrow {
  width: 0;
  height: 0;
  border-style: solid;
  position: absolute;
  margin: 10px;
}
.what-a-container[x-placement^="top"] {
  margin-bottom: 10px;
}
.what-a-container[x-placement^="top"] .popper__arrow {
    border-width: 10px 10px 0 10px;
    border-left-color: transparent;
    border-right-color: transparent;
    border-bottom-color: transparent;
    bottom: -10px;
    left: calc(50% - 10px);
    margin-top: 0;
    margin-bottom: 0;
}
.what-a-container[x-placement^="bottom"] {
    margin-top: 10px;
}

.what-a-container[x-placement^="bottom"] .popper__arrow {
    border-width: 0 10px 10px 10px;
    border-left-color: transparent;
    border-right-color: transparent;
    border-top-color: transparent;
    top: -10px;
    left: calc(50% - 10px);
    margin-top: 0;
    margin-bottom: 0;
}

.what-a-container[x-placement^="right"] {
    margin-left: 10px;
}
.what-a-container[x-placement^="right"] .popper__arrow {
    border-width: 10px 10px 10px 0;
    border-left-color: transparent;
    border-top-color: transparent;
    border-bottom-color: transparent;
    left: -10px;
    top: calc(50% - 10px);
    margin-left: 0;
    margin-right: 0;
}
.what-a-container[x-placement^="left"],
.tooltip[x-placement^="left"] {
    margin-right: 10px;
}
.what-a-container[x-placement^="left"] .popper__arrow {
    border-width: 10px 0 10px 10px;
    border-top-color: transparent;
    border-right-color: transparent;
    border-bottom-color: transparent;
    right: calc(0 - 10px);
    top: calc(50% - 10px);
    margin-left: 0;
    margin-right: 0;
}
.what-a-container {
  background-color: #fff;
  max-width: 95vw;
  max-height: 100vh;
  min-width: 300px;
  -webkit-overflow-scrolling: touch;
  box-sizing: border-box;
  position: relative;
  display: flex;
  flex-direction: column;
    box-shadow: 2px 2px 20px -4px rgba(0,0,0,0.25);
}
@keyframes containerPop {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.3;
  }
  100% {
    opacity: 0;
  }
}
[aria-hidden="true"] .what-a-container {
  opacity: 0;
}
.what-a-container.is-closing  {
  animation: containerPop 0.25s ease-in-out;
}
.what-a-container.is-opening  {
  animation: containerPop 0.25s ease-in-out reverse;
}
`
if (!document.getElementById('what-a-modal-style')) {
  const styleEl = document.createElement('style')
  styleEl.id = 'what-a-modal-style'
  styleEl.textContent = modalStyles
  document.head.append(styleEl)
}

// wrapClass that adds modal methods
// called with -> BaseClass
export function wrapEl (CustomClass, config) {
  return class extends wrapClass(CustomClass) {
    styleConfig (style = '') {
      style = `${style}`
      super.styleConfig(style)
    }
    setup () {
      // Called in useEffect on first render
      this.addEventListener('keydown', this)
      this.addEventListener('click', this)
      this.setAttribute('aria-hidden', 'true')
      this.setAttribute('role', 'dialog')
      this.setAttribute('hidden', 'true')
      this.setAttribute('tabIndex', '-1')
      this.classList.add('what-a-modal')
      this._setup = true
      const name = this.id.toLowerCase()
      this.modalId = name + '-modal'
      this.docId = name + '-document'
    }

    async open (props, label, caller) {
      if (!this._setup) {
        this.setup()
      }
      await closer()
      this.props = props
      this.heading = this.querySelector('h1, h2, h3, h4, h5, h6')
      this.document = document.getElementById(this.docId)
      if (this.document && !this.document.hasAttribute('role')) {
        this.document.setAttribute('role', 'document')
      }
      const autofocus =
        this.querySelector('[autofocus]') ||
        this.querySelector('[data-autofocus]')
      let focusTarget
      if (autofocus) {
        focusTarget = autofocus
      } else {
        focusTarget = this
      }
      if (label) {
        this.setAttribute('aria-label', label)
      } else if (this.heading) {
        this.heading.id = this.id + '-heading'
        this.setAttribute('aria-labelledby', this.heading.id)
        if (this.heading.hasAttribute('data-autofocus')) {
          this.heading.tabIndex = '-1'
        }
      }
      for (const child of document.body.children) {
        if (child !== this) {
          if (child.hasAttribute('aria-hidden')) {
            child.setAttribute(
              'data-keep-hidden',
              child.getAttribute('aria-hidden')
            )
          }

          if (child.hasAttribute('inert')) {
            child.setAttribute('data-keep-inert', child.getAttribute('inert'))
          }
          child.setAttribute('inert', 'true')
          child.setAttribute('aria-hidden', 'true')
        }
      }
      if (caller) {
        this.popper = new Popper(caller, this.document, {
          // positionFixed: true,
          arrow: { enabled: true }
        })
      }
      this.activeElement = document.activeElement
      this.scrollBehaviour('disable')
      this.setAttribute('aria-hidden', 'false')
      this.removeAttribute('hidden')
      this.document.classList.add('is-opening')
      await once(this.document, 'animationend')
      this.document.classList.remove('is-opening')
      this.classList.add('is-open')
      activeModal = this
      document.body.classList.add('js-modal-open')
      window.requestAnimationFrame(() => {
        focusTarget.focus()
      })
    }

    async closer () {
      activeModal = null
      this.document.classList.add('is-closing')
      await once(this.document, 'animationend')
      this.document.classList.remove('is-closing')
      this.setAttribute('aria-hidden', 'true')
      this.setAttribute('hidden', 'true')
      this.scrollBehaviour('enable')
      this.classList.remove('is-open')
      document.body.classList.remove('js-modal-open')
      for (const child of document.body.children) {
        if (child !== this) {
          if (
            child.hasAttribute('aria-hidden') &&
            child.hasAttribute('data-keep-hidden')
          ) {
            child.removeAttribute('data-keep-hidden')
          } else if (child.hasAttribute('aria-hidden')) {
            child.removeAttribute('aria-hidden')
          }

          if (
            child.hasAttribute('inert') &&
            child.hasAttribute('data-keep-inert')
          ) {
            child.removeAttribute('data-keep-inert')
          } else if (child.hasAttribute('inert')) {
            child.removeAttribute('inert')
          }
        }
      }
      if (this.popper) {
        this.popper.destroy()
      }
      window.requestAnimationFrame(() => {
        if (this.activeElement) {
          this.activeElement.focus()
        }
      })
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

    handleEvent (event) {
      if (event.type === 'keydown') {
        this.onKeydown(event)
      } else if (event.type === 'click') {
        this.onClick(event)
      }
    }

    onKeydown (event) {
      if (event.keyCode === 27) this.closer(event)
      if (event.keyCode === 9) this.maintainFocus(event)
    }
    onClick (event) {
      if (event.target.dataset.closeModal) {
        this.closer()
        event.preventDefault()
      }
    }
    maintainFocus (event) {
      const focusableNodes = Array.from(
        this.querySelectorAll(FOCUSABLE_ELEMENTS)
      )
      const focusedItemIndex = focusableNodes.indexOf(document.activeElement)
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

    disconnectedCallback () {
      this.element.removeEventListener('keydown', this)
      this.element.removeEventListener('click', this)
    }
  }
}

// createModal that creates the custom elements required
// called with -> id, renderer, config
const createdModals = {}
export function createModal (id, renderer, config) {
  config.wrapEl = wrapEl
  const baseRender = el => {
    const { props = {} } = el
    const docId = id + '-document'
    return html`<div id=${docId} class=${'what-a-container'}>
${renderer(props, config)}
${config.popper ? html`<div class="popper__arrow" x-arrow=""></div>` : ''}
  </div>`
  }
  createdModals[id] = createElement(baseRender, config)
  window.customElements.define(id + '-modal', createdModals[id])
}

// opener -> makes and prepends modal if necessary. Calls its open() method with props
// called with -> id, props
export function opener (id, props, label, caller) {
  let modal = document.getElementById(id)
  if (!modal && createdModals[id]) {
    modal = document.createElement(id + '-modal')
    modal.setAttribute('id', id)
    document.body.prepend(modal)
  }
  modal.open(props, label, caller)
}

document.body.addEventListener('click', event => {
  if (activeModal && !activeModal.contains(event.target)) {
    closer()
  }
})

// closer -> closes all modals
export function closer () {
  return Promise.resolve().then(() => {
    if (activeModal) {
      const modal = activeModal
      activeModal = null
      return modal.closer()
    }
  })
}

// preview, recreates menu modal

export const title = 'Create Modal'
export const description = `Create Modal with included styles`

export const preview = () => {
  const render = ({ children = [] }, config) => {
    return html`<button @click=${() => {
      closer()
    }}>close</button><ol>
      ${children.map(item => html`<li>${item}</li>`)}
    </ol>`
  }
  createModal('test-modal', render, { popper: true })

  return html`<button id="test-button" @click=${event =>
    opener(
      'test-modal',
      {
        children: ['one', 'two', 'three']
      },
      'Label This',
      document.getElementById('test-button')
    )}>Button1</button><button @click=${event =>
    opener(
      'test-modal',
      {
        children: ['Einn', 'Tveir', 'Þrír']
      },
      'Label This'
    )}>Button2</button>`
}
