import { html } from 'lit-html'
import { classMap } from 'lit-html/directives/class-map.js'
import { component } from 'haunted'

export const title = 'Text Button: `<text-button>`'

export const description = `The default text button`
// http://localhost:8080/demo/?component=/components/widgets/text-button.js
export const preview = () => {
  return html`<text-button>Fancy Button</text-button> <text-button secondary>Secondary Button</text-button><text-button disabled>Disabled Button</text-button><text-button dropdown>Dropdown Button</text-button><text-button dropdown secondary>Dropdown Button</text-button><text-button dropdown compact secondary>Dropdown Button</text-button><text-button dropdown compact>Dropdown Button</text-button><text-button working>Fetching</text-button><text-button working secondary>Fetching</text-button>`
}

export const InkButton = ({
  disabled,
  secondary,
  dropdown,
  compact,
  working,
  dangerous,
  closer
}) => {
  return html`<style>
    :host(:not([hidden])) {
      display: inline-block;
    }
    :host(:focus) {
      outline: solid transparent;
    }
button {
  font-family: var(--sans-fonts);
  font-size: 0.75rem;
  flex: 0 1 auto;
  line-height: 1;

  display: inline-block;

  padding: 0.25rem 1rem 0.25rem;

  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  text-align: center;
  white-space: nowrap;
  text-decoration: none;
  text-transform: uppercase;
  font-weight: 400;
  color: var(--link);
  border-radius: var(--border-radius);
  -ms-touch-action: manipulation;
  touch-action: manipulation;
  background-color: transparent;
  border: none;
  text-decoration: none !important;
  position: relative;
}
button:hover {
  color: white !important;
  background-color: var(--rc-dark);
  border-color: var(--rc-dark);
  box-shadow: none;
  text-decoration: none;
}
button:active {
  background-color: var(--active);
  border-color: var(--active);
}
button[disabled] {
  background-color: #eee;
  background-image: none;
  border-color: #eee;
  color: #bbb;
  cursor: not-allowed;
}
@keyframes outlinePop {
  0% {
    box-shadow: 0 0 0 1px rgba(33, 33, 33, 0);
  }
  50% {
    box-shadow: 0 0 0 8px var(--rc-darker);
  }
  100% {
    box-shadow: 0 0 0 3px var(--rc-dark);
  }
}
button:focus {
    box-shadow: 0 0 0 3px var(--rc-dark);
    outline: solid transparent;
    animation: outlinePop 0.25s ease-in-out;
}
button[disabled]:focus, {
  border-color: #999;
  background-color: var(--disabled);
  box-shadow: inset 0 0px 2px 0 rgba(0, 66, 98, 0.15);
  background-image: none;
}
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(180deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.working {
  padding-right: 1.75rem;
}
.working svg {
  display: inline-block;
  content: '';
    position: absolute;
    top: 7px;
    right: 10px;
  animation: spin 0.5s linear infinite;
  width: 16px;
  height: 16px;
}
  </style>
      <button ?disabled=${disabled} class=${classMap({
  secondary,
  dropdown,
  compact,
  working,
  dangerous
})} ?data-modal-close=${closer}><slot>Button</slot>${
  working
    ? html`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="round"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>`
    : ''
}</button>`
}

InkButton.observedAttributes = ['disabled', 'dangerous', 'working', 'closer']

window.customElements.define(
  'text-button',
  component(InkButton, window.HTMLElement, {
    shadowRootInit: { delegatesFocus: true }
  })
)
