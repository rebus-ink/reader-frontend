const { clean } = require('../server/utils/sanitize-state')
const { arrify } = require('./util-arrify.js')
const { getId } = require('./utils/get-id.js')
// Need to make sure this has a return link and location markers
module.exports.tocSidebarView = (render, model, req) => {
  const returnURL = `/library/info/${encodeURIComponent(getId(model.id))}`
  return render(
    model,
    ':tocSidebarView'
  )`<div class="NavSidebar NavSidebar--toc" id="NavSidebar">
  <a href="${returnURL}" class="TextButton TextButton--tocReturn" aria-label="Return to Book Information">&lt; Return</a>
  <h1 class="NavSidebar-title">${[clean(model.name)]}</h1>
  <h2 class="NavSidebar-subtitle">Contents</h2>
  <ol>
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
      req.params.chapter === String(index)
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
