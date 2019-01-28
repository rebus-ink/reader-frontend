const { navSidebarView } = require('./nav-sidebar.js')
const { topMenuMain } = require('./menus-main.js')
module.exports.pageBody = (render, model, req) => render(
  model,
  ':libraryBody'
)`<body>
<div class="Layout" id="layout">
  ${navSidebarView(render, model, req)}
  <main class="Settings" id="Settings" tabindex="-1">
  ${topMenuMain(render, model)}<h2>Settings</h2></main>
</div></body>`
