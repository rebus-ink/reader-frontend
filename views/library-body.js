import { libraryBooksView } from './library-books.js'
import { navSidebarView } from './nav-sidebar.js'
export const pageBody = (render, model) => render(
  model,
  ':libraryBody'
)`<div class="Layout">
  ${navSidebarView(render, model)}
  ${libraryBooksView(render, model)}
</div>`
