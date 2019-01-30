const { tocSidebarView } = require('./toc-sidebar.js')
const { chapterView } = require('./chapter.js')
const { topMenuMain } = require('./menus-main.js')
module.exports.pageBody = (render, model, req) => render(
  model,
  ':libraryBody'
)`<body class="Layout Layout--reader">
  ${tocSidebarView(render, model.book, req)}
  <nav class="Menu Menu--reader">
<ul class="Menu-list">
  <li>${topMenuMain(render, model)}</li>
</ul>
</nav>
  <main id="chapter" class="Chapter">
  ${chapterView(render, model)}</main></body>`
