import { navSidebarView } from './nav-sidebar.js'
import { topMenuMain } from './menus-main.js'
export const pageBody = (render, model, req) => render(
  model,
  ':libraryBody'
)`<div class="Layout" id="layout">
  ${navSidebarView(render, model, req)}
  <main class="Import" id="Import">
  ${topMenuMain(render, model)}
  <div>
  <h2>Import</h2>
  <p>Please stay on this page while your books are being uploaded. Navigating away from this page or reloading it will disrupt imports that are in progress.</p>
  <form is='epub-import'>
    <input type='file'>
    <div data-upload-progress></div>
    <ul data-upload-log></ul>
  </form>
  </div>
  </main>
</div>`
