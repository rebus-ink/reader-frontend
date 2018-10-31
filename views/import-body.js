import { navSidebarView } from './nav-sidebar.js'
export const pageBody = (render, model, req) => render(
  model,
  ':libraryBody'
)`<div class="Layout">
  ${navSidebarView(render, model, req)}
  <main id="Import" class="Import"><h2>Import</h2></main>
</div>`
