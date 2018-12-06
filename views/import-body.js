import { navSidebarView } from './nav-sidebar.js'
import { topMenuMain } from './menus-main.js'
export const pageBody = (render, model, req) => render(
  model,
  ':libraryBody'
)`<div class="Layout" id="layout">
  ${navSidebarView(render, model, req)}
  <main class="Import" id="Import" tabindex="-1">
  ${topMenuMain(render, model)}
  <h2>Import</h2>
  <form is='epub-import'>
    <input type='file'>
    <div data-upload-progress></div>
    <ul data-upload-log></ul>
  </form>
  </main>
</div>`
