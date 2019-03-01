import {html} from 'lighterhtml'
import { tocSidebar } from './toc-sidebar.js'
import { tocButton } from './toc-button.js'
import { floatingButtons } from './floating-buttons.js'

export function chapter (state) {
  const {dom, book} = state
  return html`${tocSidebar(state)}
  <nav class="Menu Menu--reader" id="NavMenu">
<ul class="Menu-list">
  <li>${tocButton(state)}</li>
  <li>
  <details class="MenuButton">
<summary class="MenuButton-summary">${book.name}</summary>
<ol class="MenuButton-body">
<li><a href="/library" class="MenuItem">Return to Library</a></li>
<li><hr class="MenuButton-separator"></li>
<li><a href="${window.location.pathname + '?notes=true'}" class="MenuItem">Notes view</a></li>
<li><a href="${window.location.pathname +
  '?settings=true'}" class="MenuItem">Reading Settings</a></li>
</ol>
</details></li>
<li>
<details class="MenuButton">
<summary class="MenuButton-summary">Headings</summary>
<ol class="MenuButton-body">
<li><a href="/library" class="MenuItem">Return to Library</a></li>
</ol>
</details></li>
</ul>
${floatingButtons(state)}
</nav>
  <main id="chapter" class="Chapter">
  ${dom}<div id="sidebar"></div></main></body>`
}
