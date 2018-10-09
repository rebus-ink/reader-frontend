import distanceInWordsToNow from 'date-fns/distance_in_words_to_now'
const notSelected = 'BookCard is-selectable'
const selected = 'BookCard is-selectable is-selected'

export const bookCardView = (render, model) => render(model, ':bookCard')`
<div class=${model.isSelected ? selected : notSelected}>
  <img  class="BookCard-icon" alt="${model.cover.summary}" src=${
  model.cover.url
} width=${model.cover.width} height=${model.cover.height}>
  <div class="BookCard-group">
    <h4 class="BookCard-title"><a href="#" class="BookCard-link">${
  model.name
}</a></h4>
    <p class="BookCard-paragraph">${attributionsMap(
    model.attributions,
    render
  )}</p>
    <p class="BookCard-paragraph BookCard-paragraph--tags">
      ${
  model.highlights
    ? render(
      model,
      ':bookCard-tag--highlight'
    )`<span class="BookCard-tag BookCard-tag--highlight">${
      model.highlights.length
    } highlights</span>`
    : ''
}
      ${
  model.notes
    ? render(
      model,
      ':bookCard-tag--note'
    )`<span class="BookCard-tag BookCard-tag--note">${
      model.notes.length
    } notes</span>`
    : ''
}
      ${
  model.tags
    ? model.tags.map(
      tag =>
        render(tag, ':bookCard-tag')`<span class="BookCard-tag">${
          tag.name
        }</span>`
    )
    : ''
}
    </p>
  </div>
  <div class="BookCard-progress">
    <h5 class="BookCard-sessions-label">Sessions (${model.sessions.length})</h5>
    <ol class="BookCard-sessions">
      ${sessionsMap(model.sessions, render)}
    </ol>
    <p class="BookCard-total">${model.length} pages</p>
  </div>
</div>`

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

function sessionsMap (sessions = [], render) {
  return sessions.map((session, index) => {
    return render(
      session,
      ':bookCard-session'
    )`<li class="BookCard-session"><em class="BookCard-session-time">${distanceInWordsToNow(
      session.created
    )}:</em>  <span class="BookCard-session-pages">${session.start}-${
      session.end
    }</span></li>`
  })
}
