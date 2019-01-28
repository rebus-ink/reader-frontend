const { navSidebarView } = require('./nav-sidebar.js')
const { topMenuMain } = require('./menus-main.js')
module.exports.pageBody = (render, model, req) => render(
  model,
  ':libraryBody'
)`<body>
<div class="Layout" id="layout">
  ${navSidebarView(render, model, req)}
  <main class="Notes" id="Notes" tabindex="-1">
  ${topMenuMain(render, model)}<h2>Notes ${req.params.noteId || ''}</h2></main>
</div></body>`
