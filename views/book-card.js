const { getId } = require('./utils/get-id.js')
const notSelected = 'BookCard is-selectable'
const selected = 'BookCard is-selectable is-selected'

module.exports.bookCardView = (render, model = { cover: {} }) => {
  const { cover = {}, id = '' } = model
  const url = `/library/info/${encodeURIComponent(getId(id))}`
  return render(model, ':bookCard')`
<div class=${model.isSelected ? selected : notSelected}>
  <img  class="BookCard-icon" alt="${cover.summary}" src=${cover.url}>
  <div class="BookCard-group">
    <h4 class="BookCard-title"><a href="${url}" class="BookCard-link">${
  model.name
}</a></h4>
    <p class="BookCard-paragraph">${attributionsMap(
    model.attributions,
    render
  )}</p>
    <p class="BookCard-paragraph BookCard-paragraph--tags">
    </p>
    <p class="BookCard-total"></p>
  </div>
</div>`
}

function attributionsMap (attributions = [], render) {
  return attributions.map((attribution, index) => {
    return render(
      attribution,
      ':bookCard-attribution'
    )`<span class="BookCard-attribution">${
      attribution.name
    }</span> ${attribution.roles.map(
      role =>
        render(
          attribution,
          ':bookCard-attributionLabel'
        )`<span class="BookCard-attributionLabel">(${role})</span>`
    )}${index !== attributions.length - 1 ? ', ' : ''}`
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
