import distanceInWordsToNow from 'date-fns/distance_in_words_to_now'

export const infoCardView = (render, model) => render`<div class="InfoCard">
<div class="Row Row--titleRow">
  <h3 class="Row-title Row-title--cardTitle">${model.name}</h3>
  <button class="Row-button">Read</button>
</div>
<details class="InfoCard-detail" open>
  <summary>Metadata</summary>
  ${attributionsMap(model.attributions, render)}
</details>
<details class="InfoCard-detail">
  <summary>Table of Contents</summary>
  <div class="InfoCard-contents">
    ${[model.toc]}
  </div>
</details>
<details class="InfoCard-detail">
    <summary>Sessions (${model.sessions.length})</summary>
  <div class="InfoCard-contents">
    <ol class="BookCard-sessions">
    ${sessionsMap(model.sessions, render)}
    </ol>
  </div>
</details>
<details class="InfoCard-detail">
  <summary>Annotations &amp; Notes</summary>
  <div class="InfoCard-contents">
  Something small enough to escape casual notice.
  </div>
</details>
<details class="InfoCard-detail">
  <summary>Preview</summary>
  <div class="InfoCard-contents">
  Something small enough to escape casual notice.
  </div>
</details>
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
    )}`
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
