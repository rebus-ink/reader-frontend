
import {arrify} from '../utils/arrify.js'

import $, {html} from 'neverland'
const notSelected = 'BookCard is-selectable'
const selected = 'BookCard is-selectable is-selected'

const attributionComponent = (attribution, index) => $(() => {
  return html`<span class="BookCard-attribution">${
    attribution.name
  }</span>`
})

export const viewBook = $((book, tags, dispatch) => {
  const { icon = {} } = book
  if (!icon.url) {
    icon.url = '/static/placeholder-cover.jpg'
  }
  const pathname = new URL(book.id).pathname
  const url = `/library${pathname}`
  return html`<div class=${book.isSelected ? selected : notSelected}><a href="${url}" class="">
  <img class="BookCard-icon" alt="${icon.summary}" src="${`/images/resize/240/0/${encodeURIComponent('/static/placeholder-cover.jpg')}`}" data-lazy-src=${`/images/resize/240/0/${encodeURIComponent(getURL(icon.url))}`}></a>
  <div class="BookCard-group">
    <h4 class="BookCard-title"><a href="${url}" class="BookCard-link">${
  book.name
}</a></h4>
    <p class="BookCard-paragraph">${arrify(book.attributedTo).map(attributionComponent)}</p>
    <p class="BookCard-total"></p>
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

// function sendEvent (event, dispatch) {
//   const element = event.currentTarget
//   const action = {
//     dispatch,
//     tag: {
//       id: element.dataset.tagId,
//       name: element.textContent
//     },
//     book: element.dataset.bookId
//   }
//   if (element.dataset.selected === 'true') {
//     action.type = 'remove-from-collection'
//   } else {
//     action.type = 'add-to-collection'
//   }
//   return dispatch(action)
// }
