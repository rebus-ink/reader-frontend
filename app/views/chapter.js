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
  ${dom}<div id="sidebar"></div></main></body>`
}
