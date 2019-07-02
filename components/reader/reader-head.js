import { html } from 'lit-html'
import { createElement } from '../utils/create-element.js'
import { opener } from '../utils/create-modal.js'
import '../widgets/icon-link.js'

const style = `
reader-head {
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
reader-head button {
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
}`

const render = ({ name, returnPath, book, current }) => {
  return html`<ol class="App-menu-list">
    <li><button aria-label="Contents" @click=${ev => {
    opener('ink-contents', { book, current, returnPath }, 'Contents')
  }}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg></button></li>
    <li class="App-menu-centre"><span class="menu-name">${name}</span></li>
    <li></li>
  </ol>`
}

const ReaderHead = createElement(render, {
  observedAttributes: ['name', 'returnPath'],
  style
})
window.customElements.define('reader-head', ReaderHead)
