import { libraryBooksView } from './library-books.js'
import { navSidebarView } from './nav-sidebar.js'
import { infoCardView } from './info-card.js'
export const pageBody = (render, model) => render(
  model,
  ':libraryBody'
)`<div class="Layout">
  ${navSidebarView(render, model)}
  ${libraryBooksView(render, model)}
  ${infoCardView(render, model.books[0])}
</div>`
