import { navSidebarView } from './nav-sidebar.js'
import { topMenuMain } from './menus-main.js'
export const pageBody = (render, model, req) => render(
  model,
  ':libraryBody'
)`<body>
<div class="Layout" id="layout">
  ${navSidebarView(render, model, req)}
  <main class="Notes" id="Notes" tabindex="-1">
  ${topMenuMain(render, model)}<h2>Notes ${req.params.noteId || ''}</h2></main>
</div></body>`
