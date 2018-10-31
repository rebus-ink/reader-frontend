import distanceInWordsToNow from 'date-fns/distance_in_words_to_now'
import { topMenuInfo } from './menus-info.js'

export const infoCardView = (render, model) => render(
  model,
  ':infoCard'
)`<div class="InfoCard InfoSidebar">
${topMenuInfo(render, model)}
<div class="Row Row--titleRow">
  <h3 class="Row-title Row-title--cardTitle">${model.name}</h3>
  <button class="Row-button">Read</button>
</div>
<details class="InfoCard-detail" open>
  <summary>Metadata</summary>
  <ul class="InfoCard-contents">
  ${attributionsMap(model.attributions, render)}
  </ul>
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

function sessionsMap (sessions = [], render) {
  return sessions.map((session, index) => {
    return render(
      session,
      ':bookCard-session'
    )`<li class="BookCard-session"><em class="BookCard-session-time">${distanceInWordsToNow(
      session.published
    )}:</em>  <span class="BookCard-session-pages">${session.start}-${
      session.end
    }</span></li>`
  })
}
