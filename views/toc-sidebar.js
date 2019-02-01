const { clean } = require('../server/utils/sanitize-state')
const { arrify } = require('./util-arrify.js')
const { getId } = require('./utils/get-id.js')
// const debug = require('debug')('vonnegut:views:tocSidebar')
// Need to make sure this has a return link and location markers
module.exports.tocSidebarView = (render, model, req) => {
  return render(
    model,
    ':tocSidebarView'
  )`<div class="NavSidebar NavSidebar--toc" id="NavSidebar">
  <h1 class="NavSidebar-title NavSidebar-body">${[clean(model.name)]}</h1>
  <h2 class="NavSidebar-subtitle NavSidebar-body">Contents</h2>
  <ol class="NavSidebar-body">
${renderToC(render, model, req)}
  </ol>
</div>`
}

function renderToC (render, model, req) {
  return arrify(model.orderedItems).map((chapter, index) => {
    const url = `/reader/${encodeURIComponent(getId(model.id))}/${
      chapter['reader:path']
    }`
    const isSelected =
      req.params[0] === decodeURIComponent(chapter['reader:path'])
        ? 'NavSidebar-item is-selected'
        : 'NavSidebar-item'
    const ariaCurrent = req.params.chapter === String(index) ? 'page' : false
    return render(
      chapter,
      ':toc-entry'
    )`<li class="${isSelected}"><a href="${url}" class="NavSidebar-link" aria-current=${ariaCurrent}>${
      chapter.name
    }</a></li>`
  })
}
