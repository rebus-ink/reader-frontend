import { html } from 'lit-html'
import { useModal } from './hooks/useModal.js'
import { classMap } from 'lit-html/directives/class-map.js'
import { component, useEffect } from 'haunted'

export const title = 'Modal: `<ink-menu-modal>`'

export const description = `The the menu modal card, wraps its light-dom in a modal`

// http://localhost:8080/demo/?component=/components/menumodal.component.js&imports=/components/modal-closer.component.js,/components/button.component.js
export const preview = () => {
  return html`<ink-button dropdown @click=${event => {
    document.getElementById('modal-1').open = event.target
  }}>open modal</ink-button><ink-button dropdown @click=${event => {
    document.getElementById('modal-1').open = event.target
  }}>open bigger</ink-button><ink-menu-modal id="modal-1"><strong slot="modal-title">Fancy Title</strong><p slot="modal-body" style="padding: 1rem;">Fancy body</p></ink-menu-modal>`
}

export const InkMenuModal = ({ open }) => {
  const [opener] = useModal({ animation: true })
  useEffect(
    () => {
      if (open) {
        opener(open)
      }
    },
    [open]
  )
  return html`<style>
.overlay {
  --arrow-size: 10px;
}
.container .popper__arrow {
    width: 0;
    height: 0;
    border-style: solid;
    position: absolute;
    margin: 10px;
}
.container .popper__arrow {
    border-color: white;
}
.container[x-placement^="top"] {
    margin-bottom: 10px;
}
.container[x-placement^="top"] .popper__arrow {
    border-width: 10px 10px 0 10px;
    border-left-color: transparent;
    border-right-color: transparent;
    border-bottom-color: transparent;
    bottom: -10px;
    left: calc(50% - 10px);
    margin-top: 0;
    margin-bottom: 0;
}
.container[x-placement^="bottom"] {
    margin-top: 10px;
}

.container[x-placement^="bottom"] .popper__arrow {
    border-width: 0 10px 10px 10px;
    border-left-color: transparent;
    border-right-color: transparent;
    border-top-color: transparent;
    top: -10px;
    left: calc(50% - 10px);
    margin-top: 0;
    margin-bottom: 0;
}

.container[x-placement^="right"] {
    margin-left: 10px;
}
.container[x-placement^="right"] .popper__arrow {
    border-width: 10px 10px 10px 0;
    border-left-color: transparent;
    border-top-color: transparent;
    border-bottom-color: transparent;
    left: -10px;
    top: calc(50% - 10px);
    margin-left: 0;
    margin-right: 0;
}
.container[x-placement^="left"],
.tooltip[x-placement^="left"] {
    margin-right: 10px;
}
.container[x-placement^="left"] .popper__arrow {
    border-width: 10px 0 10px 10px;
    border-top-color: transparent;
    border-right-color: transparent;
    border-bottom-color: transparent;
    right: calc(0 - 10px);
    top: calc(50% - 10px);
    margin-left: 0;
    margin-right: 0;
}
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: transparent;
  display: flex;
  z-index: 4;
}

header {
  border-bottom: 1px solid #ddd;
}

.container {
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
[aria-hidden="true"] .container {
  opacity: 0;
}
.container.is-closing  {
  animation: containerPop 0.25s ease-in-out;
}
.container.is-opening  {
  animation: containerPop 0.25s ease-in-out reverse;
}


.content {
  display: flex;
  flex-direction: column;
}
.content > * {
  margin: auto;
}

.title {
  font-weight: 600;
  font-size: 0.75rem;
  line-height: 1;
  box-sizing: border-box;
  text-transform: uppercase;
  padding: 1rem 2rem;
  text-align: center;
  margin: 0;
}

.row {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.text {
  margin: 2rem;
}
  </style>
    <div tabindex="-1" class=${classMap({
    overlay: true
  })} data-modal-close>
      <div role="dialog" class="container" id='container' aria-modal="true" aria-labelledby="modal-1-title" >
        <header>
          <h2 class="title"><slot name="modal-title" id="title">Title</slot></h2>
          <ink-modal-closer></ink-modal-closer>
        </header>
        <div id="modal-1-content" class="content"><slot name="modal-body">Body</slot>
        </div>
        <div class="popper__arrow" x-arrow=""></div>
      </div>
    </div>`
}

window.customElements.define(
  'ink-menu-modal',
  component(InkMenuModal, window.HTMLElement)
)
