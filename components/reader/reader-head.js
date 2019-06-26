import { html } from 'lit-html'
import { createElement } from '../utils/create-element.js'
import { opener } from '../utils/create-modal.js'
import '../widgets/icon-link.js'

const style = `
reader-head {
  background-color: rgba(255,255,255,0.6);
  margin: 0;
  padding: 0.25rem;
  position: sticky;
  top: 0;
  max-height: 2rem;
  grid-column: 2 / 3;
  z-index: 2;
  display: flex;
  align-items: center;
}
reader-head icon-button {

}`

const render = ({ name, returnPath, contents }) => {
  return html`<ol class="App-menu-list">
    <li><button name="vertical-ellipsis" @click=${ev => {
    if (ev.currentTarget === ev.target) {
      opener('ink-contents', { contents }, 'Contents')
    }
  }}>Contents</button></li>
    <li><span class="reader-name">${name}</span></li>
    <li></li>
  </ol>`
}

const ReaderHead = createElement(render, {
  observedAttributes: ['name', 'returnPath'],
  style
})
window.customElements.define('reader-head', ReaderHead)
