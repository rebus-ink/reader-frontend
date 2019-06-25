import { html } from 'lit-html'
import { classMap } from 'lit-html/directives/class-map.js'
import { createElement } from '../utils/create-element.js'
import { svg } from './icon-button.js'

const style = `
icon-link a{
  line-height:1;
  display: inline-block;
  height: 24px;
}
icon-link a {
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
  color: var(--rc-dark);

  height: 24px;
    width: 24px;
    margin: 0;
    padding: 0;
  border-radius: 9999px;
}
@keyframes outlinePop {
  0% {
    transform: scale(0.5);
    stroke-width: 1px;
  }
  50% {
    transform: scale(1.5);
    stroke-width: 4px;
  }
  100% {
    transform: scale(1);
    stroke-width: 3px;
  }
}
icon-link a:focus {
  background-color: #f5f5f5;
  outline: solid transparent;
  box-shadow: 0 0 1px 1px var(--rc-light), inset 0 0 1px 1px var(--rc-light);
}
icon-link a:focus svg {
  animation: outlinePop 0.25s ease-in-out;
  stroke-width: 3px;
}
icon-link a:active {
  animation: outlinePop 0.25s ease-in-out;
  color: var(--active);
}`

const render = el => {
  const { label, dangerous, name, href } = el
  return html`<a href=${href} aria-label=${label} class=${classMap({
    dangerous
  })}>${svg(name)}</a>`
}

const IconLink = createElement(render, {
  observedAttributes: ['label', 'dangerous', 'name', 'href'],
  style
})

window.customElements.define('icon-link', IconLink)
