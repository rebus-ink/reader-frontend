import { html } from 'lit-html'
import { component } from 'haunted'

export const title = 'Menu Button: `<menu-button>`'

export const description = `The menu button`

// http://localhost:8080/demo/?component=/components/menu-button.component.js&imports=/js/vendor/@github/details-menu-element.js
export const preview = () => {
  return html`<menu-button>
  <details class="InkMenuButton">
  <summary class="InkMenuSummary">Robots</summary>
  <details-menu role="menu">
    <button type="button" role="menuitem" class="MenuItem">Hubot</button>
    <button type="button" role="menuitem" class="MenuItem MenuItem--selected">Bender</button>
    <button type="button" role="menuitem" class="MenuItem">BB-8</button>
    <button type="button" role="menuitem" class="MenuItem">Hubot</button>
    <button type="button" role="menuitem" class="MenuItem">Bender</button>
    <button type="button" role="menuitem" class="MenuItem">BB-8</button>
    <button type="button" role="menuitem" class="MenuItem">Hubot</button>
    <button type="button" role="menuitem" class="MenuItem">Bender</button>
    <button type="button" role="menuitem" class="MenuItem">BB-8</button>
    <button type="button" role="menuitem" class="MenuItem">Hubot</button>
    <button type="button" role="menuitem" class="MenuItem">Bender</button>
    <button type="button" role="menuitem" class="MenuItem">BB-8</button>
  </details-menu>
</details>
    </menu-button><menu-button secondary>
  <details class="InkMenuButton">
  <summary class="InkMenuSummary InkMenuSummary--secondary">Robots</summary>
  <details-menu role="menu">
    <button type="button" role="menuitem" class="MenuItem">Hubot</button>
    <button type="button" role="menuitem" class="MenuItem">Bender</button>
    <button type="button" role="menuitem" class="MenuItem MenuItem--selected">BB-8</button>
    <button type="button" role="menuitem" class="MenuItem">Hubot</button>
    <button type="button" role="menuitem" class="MenuItem">Bender</button>
    <button type="button" role="menuitem" class="MenuItem">BB-8</button>
    <button type="button" role="menuitem" class="MenuItem">Hubot</button>
    <button type="button" role="menuitem" class="MenuItem">Bender</button>
    <button type="button" role="menuitem" class="MenuItem">BB-8</button>
    <button type="button" role="menuitem" class="MenuItem">Hubot</button>
    <button type="button" role="menuitem" class="MenuItem">Bender</button>
    <button type="button" role="menuitem" class="MenuItem">BB-8</button>
  </details-menu>
</details>
    </menu-button>`
}

export const InkMenuButton = ({ disabled, name, secondary }) => {
  return html`
    <slot>Items</slot>`
}

InkMenuButton.observedAttributes = ['disabled', 'name', 'secondary']

window.customElements.define(
  'menu-button',
  component(InkMenuButton, window.HTMLElement)
)
