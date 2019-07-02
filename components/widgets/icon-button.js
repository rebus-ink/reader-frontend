import { html } from 'lit-html'
import { component } from 'haunted'

export const title = 'Icon Buttons: `<icon-button>`'

export const description = `Icon buttons. Icons from https://iconsvg.xyz, MIT licensed`

// http://localhost:8080/demo/?component=/components/widgets/icon-button.js
export const preview = () => {
  return html`<p>
    <icon-button name="left-chevron"></icon-button><icon-button name="right-chevron"></icon-button><icon-button name="left-arrow"></icon-button><icon-button name="right-arrow"></icon-button><icon-button name="grid"></icon-button><icon-button name="menu"></icon-button><icon-button name="settings"></icon-button><icon-button name="search"></icon-button><icon-button name="highlight"></icon-button><icon-button name="vertical-ellipsis"></icon-button><icon-button name="horizontal-ellipsis"></icon-button><icon-button name="bookmark"></icon-button><icon-button name="filled-bookmark"></icon-button><icon-button name="comment"></icon-button><icon-button name="comment-square"></icon-button><icon-button name="enter-fullscreen"></icon-button><icon-button name="exit-fullscreen"></icon-button><icon-button name="split"></icon-button><icon-button name="cancel"></icon-button>
  </p>
  <p>
    <icon-button selected name="left-chevron"></icon-button><icon-button selected name="right-chevron"></icon-button><icon-button selected name="left-arrow"></icon-button><icon-button selected name="right-arrow"></icon-button><icon-button selected name="grid"></icon-button><icon-button selected name="menu"></icon-button><icon-button selected name="settings"></icon-button><icon-button selected name="search"></icon-button><icon-button selected name="highlight"></icon-button><icon-button selected name="vertical-ellipsis"></icon-button><icon-button selected name="horizontal-ellipsis"></icon-button><icon-button selected name="bookmark"></icon-button><icon-button selected name="comment"></icon-button><icon-button selected name="comment-square"></icon-button><icon-button selected name="enter-fullscreen"></icon-button><icon-button selected name="exit-fullscreen"></icon-button><icon-button selected name="split"></icon-button>
  </p>
  `
}

export const names = [
  'cancel',
  'left-chevron',
  'right-chevron',
  'left-arrow',
  'right-arrow',
  'grid',
  'menu',
  'settings',
  'search',
  'highlight',
  'vertical-ellipsis',
  'horizontal-ellipsis',
  'filled-bookmark',
  'bookmark',
  'comment',
  'comment-square',
  'enter-fullscreen',
  'exit-fullscreen',
  'split'
]

export const IconButton = el => {
  const { name, click, selected } = el
  return html`<style>
:host {
  line-height:1;
  display: inline-block;
  height: 24px;
}
:host(:focus) {
  outline: solid transparent;
}
.button {
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
.button:focus {
  background-color: #f5f5f5;
  outline: solid transparent;
  box-shadow: 0 0 1px 1px var(--rc-light), inset 0 0 1px 1px var(--rc-light);
}
.button:focus svg {
  animation: outlinePop 0.25s ease-in-out;
  stroke-width: 3px;
}
.button:active {
  animation: outlinePop 0.25s ease-in-out;
  color: var(--active);
}
[selected] svg {
  fill: var(--rc-light);
}
  </style>
          <button aria-label=${
  el.textContent
} class="button" @click=${click} ?selected=${selected} ?data-modal-close=${el.closest(
  'icon-button[data-modal-close]'
)}>${svg(name)}</button>`
}

export function svg (name) {
  switch (name) {
    case 'cancel':
      return html`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`
    case 'exit-fullscreen':
      return html`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="round"><path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"></path></svg>`
    case 'enter-fullscreen':
      return html`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path></svg>`
    case 'comment-square':
      return html`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>`
    case 'comment':
      return html`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>`
    case 'filled-bookmark':
      return html`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>`
    case 'bookmark':
      return html`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>`
    case 'vertical-ellipsis':
      return html`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>`
    case 'horizontal-ellipsis':
      return html`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>`
    case 'highlight':
      return html`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="round"><polygon points="14 2 18 6 7 17 3 17 3 13 14 2"></polygon><line x1="3" y1="22" x2="21" y2="22" stroke="#eded00" stroke-width="6"></line></svg>`
    case 'search':
      return html`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`
    case 'settings':
      return html`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="round"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></svg>`
    case 'menu':
      return html`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`
    case 'split':
      return html`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M12 3v18"/></svg>`
    case 'grid':
      return html`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>`
    case 'right-arrow':
      return html`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="round"><path d="M5 12h13M12 5l7 7-7 7"/></svg>`
    case 'left-arrow':
      return html`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="round"><path d="M19 12H6M12 5l-7 7 7 7"/></svg>`
    case 'left-chevron':
      return html`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>`
    case 'right-chevron':
      return html`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>`
    case 'plus':
      return html`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>`
    default:
      break
  }
}
IconButton.observedAttributes = [
  'name',
  'selected',
  'label',
  'data-modal-close'
]

window.customElements.define(
  'icon-button',
  component(IconButton, window.HTMLElement, {
    shadowRootInit: { delegatesFocus: true }
  })
)
