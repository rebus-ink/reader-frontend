const { navSidebarView } = require('./nav-sidebar.js')
const { infoCardView } = require('./info-card.js')
const { returnMenu } = require('./menus-return.js')
module.exports.pageBody = (render, model, req) => render(
  model,
  ':libraryBody'
)`<body>
<div class="Layout">
  ${navSidebarView(render, model, req)}
  <main id="info-body" class="InfoBody" tabindex="-1">
  ${returnMenu(render, model, req)}
  ${infoCardView(render, model, req)}</main>
</div></body>`
