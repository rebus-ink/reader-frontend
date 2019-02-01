const { tocSidebarView } = require('./toc-sidebar.js')
const { chapterView } = require('./chapter.js')
const { topMenuMain } = require('./menus-main.js')
const { clean } = require('../server/utils/sanitize-state')
module.exports.pageBody = (render, model, req) => render(
  model,
  ':libraryBody'
)`<body class="Layout Layout--reader">
  ${tocSidebarView(render, model.book, req)}
  <nav class="Menu Menu--reader">
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
<li><a href="#" aria-label="Previous chapter" class="ArrowButton ArrowButton--previous"><svg viewBox="0 0 10 10" width="36" height="36" fill="currentColor">
<path d="m9 4h-4v-2l-4 3 4 3v-2h4z"/>
</svg></li>
<li><a href="#" aria-label="Next chapter" class="ArrowButton ArrowButton--next"><svg viewBox="0 0 10 10" width="36" height="36" fill="currentColor">
<path d="m1 4h4v-2l4 3-4 3v-2h-4z"/>
</svg></li>
</ul>
</nav>
  <main id="chapter" class="Chapter">
  ${chapterView(render, model)}</main></body>`
