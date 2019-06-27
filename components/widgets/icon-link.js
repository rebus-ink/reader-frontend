import { html } from 'lit-html'
import { classMap } from 'lit-html/directives/class-map.js'
import { createElement } from '../utils/create-element.js'
import { svg } from './icon-button.js'

const render = el => {
  const { label, dangerous, name, href } = el
  return html`<a href=${href} aria-label=${label} class=${classMap({
    dangerous
  })}>${svg(name)}</a>`
}

const IconLink = createElement(render, {
  observedAttributes: ['label', 'dangerous', 'name', 'href']
})

window.customElements.define('icon-link', IconLink)
