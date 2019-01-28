const { getId } = require('./utils/get-id.js')
const { arrify } = require('./util-arrify.js')
const debug = require('debug')('vonnegut:views:infocard')

module.exports.infoCardView = (render, model, req) => {
  const { cover = {}, id = '' } = model.book
  const book = model.book
  debug('got model')
  const url = `/reader/${encodeURIComponent(getId(id))}`
  return render(book, ':infoCard')`<div class="InfoCard">
<div class="InfoCard-title">
  <img  class="BookCard-icon" alt="${cover.summary}" src=${cover.url} width=${
  cover.width
} height=${cover.height}> 
  <h3 class="Row-title Row-title--cardTitle">${book.name}</h3>
  <a class="Button Button--primary" href="${url}">Read</a>
</div>
<details class="InfoCard-detail" open>
  <summary>Metadata</summary>
  <ul class="InfoCard-contents">
  ${attributionsMap(book.attributions, render)}
  </ul>
</details>
<details class="InfoCard-detail">
  <summary>Table of Contents</summary>
  <div class="InfoCard-contents">
  ${renderToC(render, book, req)}
  </div>
</details>
<details class="InfoCard-detail">
  <summary>Annotations &amp; Notes</summary>
  <div class="InfoCard-contents"> </div>
</details>
<details class="InfoCard-detail">
  <summary>Preview</summary>
  <div class="InfoCard-contents"> </div>
</details>
</div>`
}

function attributionsMap (attributions = [], render) {
  return attributions.map((attribution, index) => {
    debug(attribution)
    return render(attribution, ':infoCard-attribution')`<li><span>${
      attribution.name
    }</span> ${attribution.roles.map(
      role =>
        render(
          attribution,
          ':infoCard-attributionLabel'
        )`<span>(${role})</span>`
    )}</li>`
  })
}

// function sessionsMap (sessions = [], render) {
//   return sessions.map((session, index) => {
//     return render(
//       session,
//       ':bookCard-session'
//     )`<li class="BookCard-session"><em class="BookCard-session-time">${distanceInWordsToNow(
//       session.published
//     )}:</em>  <span class="BookCard-session-pages">${session.start}-${
//       session.end
//     }</span></li>`
//   })
// }

function renderToC (render, model, req) {
  debug('rendering ToC')
  return arrify(model.orderedItems).map((chapter, index) => {
    debug(chapter)
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
