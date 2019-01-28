import { libraryBooksView } from './library-books.js'
import { navSidebarView } from './nav-sidebar.js'
export const pageBody = (render, model, req) => render(
  model,
  ':libraryBody'
)`<body><div class="Layout" id="layout">
  ${navSidebarView(render, model, req)}
  ${libraryBooksView(render, model)}
</div></body></html>`
