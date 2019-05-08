
import component, {html, useContext} from 'neverland'
import {loadBook, book} from '../reader/state.js'

export const Info = component((context, h) => {
  const {location = '', params} = context.request
  const state = useContext(book)
  if (params.bookId && !state.id.includes(params.bookId)) {
    loadBook(params.bookId)
  }
  console.log(state)
  const { icon = {} } = state
  if (!icon.url) {
    icon.url = '/static/placeholder-cover.jpg'
  }
  const href = `/library${location}`
  return html`<div class="Info">
    <a href="${href}" class="Info-return" aria-label="Return to library">&times;</a>
  <div class="Info-contents">${state.name}</div>
  <div class="Info-graphics" id="info-graphics">
    <a href="${state.position.path}" class="">
      <img class="Info-cover" alt="${icon.summary}" src="${`/images/resize/800/0/${encodeURIComponent(getURL(icon.url))}`}" data-component="average-color" data-target="info-graphics">
    </a>
    <p><a href="${state.position.path || '/images/resize/800/0/%2Fstatic%2Fplaceholder-cover.jpg'}" class="Button Info-button">Read</a></p>
  </div>
</div>`
})

function getURL (url) {
  if (Array.isArray(url)) {
    return url[0].href
  } else {
    return url
  }
}
