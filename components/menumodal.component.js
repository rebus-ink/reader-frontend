import { html } from 'lit-html'
import { useModal } from './hooks/useModal.js'
import { classMap } from 'lit-html/directives/class-map.js'
import { component, useEffect } from 'haunted'

export const title = 'Modal: `<ink-menu-modal>`'

export const description = `The the menu modal card, wraps its light-dom in a modal`

export const preview = () => {
  return html`<button @click=${event => {
    document.getElementById('modal-1').reference = event.target
  }}>open modal</button><button @click=${event => {
    document.getElementById('modal-1').reference = event.target
  }}>open bigger</button><ink-menu-modal id="modal-1" aria-hidden="true"><strong slot="modal-title">Fancy Title</strong><p slot="modal-body" style="padding: 1rem;">Fancy body</p></ink-menu-modal>`
}

export const InkMenuModal = ({ reference }) => {
  const [closer, opener] = useModal()
  useEffect(
    () => {
      if (reference) {
        opener(reference)
      }
    },
    [reference]
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

.close {
  position: absolute;
  top: 0.7rem;
  right: 0.5rem;
  font-size: 1.5rem;
  line-height: 1rem;
  transform: translateY(-2px);
  display: inline-block;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  text-align: center;
  white-space: nowrap;
  text-decoration: none;
  text-transform: uppercase;
  -ms-touch-action: manipulation;
  touch-action: manipulation;
  border: none;
  background-color: transparent;
  color: var(--rc-main);
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
          <button aria-label="Close modal" class="close" data-modal-close>&times;</button>
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
