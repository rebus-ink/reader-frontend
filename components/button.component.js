import { html } from 'lit-html'
import { classMap } from 'lit-html/directives/class-map.js'
import { component } from 'haunted'

export const title = 'Button: `<ink-button>`'

export const description = `The default button`

export const preview = () => {
  return html`<ink-button>Fancy Button</ink-button> <ink-button secondary>Secondary Button</ink-button><ink-button disabled>Disabled Button</ink-button>`
}

export const InkButton = ({ disabled, secondary }) => {
  return html`<style>
button {
  font-family: var(--sans-fonts);
  font-size: 0.65rem;
  flex: 0 1 auto;
  line-height: 1;

  display: inline-block;

  padding: 0.45rem 1.5rem 0.5rem;

  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  text-align: center;
  white-space: nowrap;
  text-decoration: none;
  text-transform: uppercase;
  font-weight: 700;
  color: var(--dark);
  border-radius: var(--border-radius);
  -ms-touch-action: manipulation;
  touch-action: manipulation;
  background-color: var(--rc-main);
  border: 2px solid var(--rc-main);
  box-shadow: 1px 2px 4px 0 rgba(33, 33, 33, 0.1);
  text-decoration: none !important;
}
button:hover {
  color: white !important;
  background-color: var(--rc-dark);
  border-color: var(--rc-dark);
  box-shadow: none;
  text-decoration: none;
}
.secondary {
  background-color: white;
  border: 2px solid var(--rc-main);
  color: var(--rc-main);
}
.secondary:hover {
  background-color: var(--rc-main);
}
button:active, .secondary:active {
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
button[disabled]:focus, {
  border-color: #999;
  background-color: var(--disabled);
  box-shadow: inset 0 0px 2px 0 rgba(0, 66, 98, 0.15);
  background-image: none;
}
  </style>
      <button ?disabled=${disabled} class=${classMap({
  secondary
})}><slot>Button</slot></button>`
}

InkButton.observedAttributes = ['disabled', 'secondary']

window.customElements.define(
  'ink-button',
  component(InkButton, window.HTMLElement)
)
