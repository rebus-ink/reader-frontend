import { navSidebarView } from './nav-sidebar.js'
import { infoCardView } from './info-card.js'
import { returnMenu } from './menus-return.js'
export const pageBody = (render, model, req) => render(
  model,
  ':libraryBody'
)`<div class="Layout">
  ${navSidebarView(render, model, req)}
  <main id="info-body" class="InfoBody" tabindex="-1">
  ${returnMenu(render, model, req)}
  ${infoCardView(render, model)}</main>
</div>`
