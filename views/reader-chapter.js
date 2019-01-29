const { tocSidebarView } = require('./toc-sidebar.js')
const { chapterView } = require('./chapter.js')
module.exports.pageBody = (render, model, req) => render(
  model,
  ':libraryBody'
)`<body class="Layout Layout--reader">
  ${tocSidebarView(render, model.book, req)}
  <main id="chapter" class="Chapter">
  ${chapterView(render, model)}</main></body>`
