import { navSidebarView } from './nav-sidebar.js'
export const pageBody = (render, model, req) => render(
  model,
  ':libraryBody'
)`<div class="Layout">
  ${navSidebarView(render, model, req)}
  <main id="Notes" class="Notes" tabindex="-1"><h2>Notes ${req.params.noteId ||
    ''}</h2></main>
</div>`
