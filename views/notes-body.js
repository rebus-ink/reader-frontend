const { navSidebarView } = require('./nav-sidebar.js')
module.exports.pageBody = (render, model, req) => render(
  model,
  ':libraryBody'
)`<body>
<div class="Layout" id="layout">
  ${navSidebarView(render, model, req)}
  <main class="Notes" id="Notes" tabindex="-1"><h2>Notes ${req.params.noteId ||
    ''}</h2></main>
</div></body>`
