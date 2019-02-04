const { tocSidebarView } = require('./toc-sidebar.js')
const { chapterView } = require('./chapter.js')
const { topMenuMain } = require('./menus-main.js')
const { floatingButtons } = require('./floating-buttons.js')
const { clean } = require('../server/utils/sanitize-state')
module.exports.pageBody = (render, model, req) => render(
  model,
  ':libraryBody'
)`<body class="Layout Layout--reader">
  ${tocSidebarView(render, model.book, req)}
  <nav class="Menu Menu--reader" id="NavMenu">
<ul class="Menu-list">
  <li>${topMenuMain(render, model)}</li>
  <li>
  <details class="MenuButton">
<summary class="MenuButton-summary">${[clean(model.book.name)]}</summary>
<ol class="MenuButton-body">
<li><a href="/library" class="MenuItem">Return to Library</a></li>
<li><hr class="MenuButton-separator"></li>
<li><a href="${req.path + '?notes=true'}" class="MenuItem">Notes view</a></li>
<li><a href="${req.path +
  '?settings=true'}" class="MenuItem">Reading Settings</a></li>
</ol>
</details></li>
<li>
<details class="MenuButton">
<summary class="MenuButton-summary">Headings</summary>
<ol class="MenuButton-body">
<li><a href="/library" class="MenuItem">Return to Library</a></li>
<li><hr class="MenuButton-separator"></li>
<li><a href="${req.path + '?notes=true'}" class="MenuItem">Notes view</a></li>
<li><a href="${req.path +
  '?settings=true'}" class="MenuItem">Reading Settings</a></li>
</ol>
</details></li>
</ul>
${floatingButtons(render, model, req)}
</nav>
  <main id="chapter" class="Chapter">
  ${chapterView(render, model)}</main></body>`
