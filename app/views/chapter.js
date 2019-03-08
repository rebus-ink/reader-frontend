import {html} from 'lighterhtml'
import { bookMenu } from './chapter-book-menu.js'
import { floatingButtons } from './floating-buttons.js'

export function chapter (state) {
  const {dom} = state
  return html`<nav class="Menu Menu--reader" id="NavMenu">
<ul class="Menu-list">
  <li>
  ${bookMenu(state)}</li>
</ul>
${floatingButtons(state)}
</nav>
  <main id="chapter" class="Chapter">
    <div class="Chapter-body">${dom}</div>
  <div id="sidebar"></div><button data-component="full-screen" class="Button Button--floating" aria-label="Full screen" id="full-screen-button"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path></svg></button></main>`
}
