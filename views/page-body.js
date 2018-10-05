import { libraryBooksView } from './library-books.js'
import { navSidebarView } from './nav-sidebar.js'
import { infoCardView } from './info-card.js'
import { topMenuNav, bottomMenuNav } from './menus-nav.js'
import { topMenuMain, bottomMenuMain } from './menus-main.js'
import { topMenuInfo, bottomMenuInfo } from './menus-info.js'
export const pageBody = (render, model) => render(
  model,
  ':pageBody'
)`<body class="Layout">
  ${topMenuNav(render, model)}
  ${topMenuMain(render, model)}
  ${topMenuInfo(render, model)}
  ${navSidebarView(render, model)}
  ${libraryBooksView(render, model)}
  ${infoCardView(render, model.books[0])}
  ${bottomMenuNav(render, model)}
  ${bottomMenuMain(render, model)}
  ${bottomMenuInfo(render, model)}
</body>
</html>`
