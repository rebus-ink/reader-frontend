import { navSidebarView } from './nav-sidebar.js'
export const pageBody = (render, model, req) => render(
  model,
  ':libraryBody'
)`<div class="Layout">
  ${navSidebarView(render, model, req)}
  <main id="settings" class="Settings" tabindex="-1"><h2>Settings</h2></main>
</div>`
