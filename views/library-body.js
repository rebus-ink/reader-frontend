const { libraryBooksView } = require('./library-books.js')
const { navSidebarView } = require('./nav-sidebar.js')
module.exports.pageBody = (render, model, req) => render(
  model,
  ':libraryBody'
)`<body class="Layout" id="layout">
  ${navSidebarView(render, model, req)}
  ${libraryBooksView(render, model)}</body></html>`
