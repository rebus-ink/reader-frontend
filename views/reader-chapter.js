import { tocSidebarView } from './toc-sidebar.js'
import { chapterView } from './chapter.js'
import { topMenuMain } from './menus-main.js'
export const pageBody = (render, model, req) => render(
  model,
  ':libraryBody'
)`<body>
<div class="Layout Layout--reader">
  ${tocSidebarView(render, model.book, req)}
  ${topMenuMain(render, model)}
  <main id="chapter" class="Chapter">
  ${chapterView(render, model)}</main>
</div></body>`
