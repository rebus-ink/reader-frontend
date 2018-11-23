import { tocSidebarView } from './toc-sidebar.js'
import { chapterView } from './chapter.js'
import { topMenuMain } from './menus-main.js'
export const pageBody = (render, model, req) => render(
  model,
  ':libraryBody'
)`<div class="Layout Layout--reader">
  ${tocSidebarView(render, model.book, req)}
  <main id="chapter" class="Chapter" tabindex="-1">
  ${topMenuMain(render, model)}
  ${chapterView(render, model)}</main>
</div>`
