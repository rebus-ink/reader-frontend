import { html } from 'lit-html'
import { component } from 'haunted'

export const title = 'Modal Closer: `<ink-modal-closer>`'

export const description = `The modal closer button`

export const preview = () => {
  return html`<ink-modal-closer></ink-modal-closer>`
}

export const InkModalCloser = () => {
  return html`<style>

.close {
  position: absolute;
  top: 0.8rem;
  left: 0.5rem;
  font-size: 1.25rem;
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

  height: 30px;
    width: 30px;
    margin: 0;
    padding: 0;
}
@keyframes outlinePop {
  0% {
    transform: scale(1);
    stroke-width: 1px;
  }
  50% {
    transform: scale(1.5);
    stroke-width: 8px;
  }
  100% {
    transform: scale(1);
    stroke-width: 3px;
  }
}
.close:focus {
  background-image: radial-gradient(circle closest-side, #f7f7f7 0%, #f7f7f7 95%, transparent );
  
  outline: solid transparent;
}
.close:focus svg {
  animation: outlinePop 0.25s ease-in-out;
  stroke-width: 3px;
}
  </style>
          <button aria-label="Close modal" class="close" data-modal-close><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button>`
}

window.customElements.define(
  'ink-modal-closer',
  component(InkModalCloser, window.HTMLElement, {
    shadowRootInit: { delegatesFocus: true }
  })
)
