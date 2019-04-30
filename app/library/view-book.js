
import {arrify} from '../utils/arrify.js'

import $, {html} from 'neverland'
const notSelected = 'BookCard is-selectable'
const selected = 'BookCard is-selectable is-selected'

export const viewBook = $((book, tags, dispatch) => {
  const { icon = {} } = book
  if (!icon.url) {
    icon.url = '/static/placeholder-cover.jpg'
  }
  const pathname = new URL(book.id).pathname
  const url = `/reader${pathname}`
  return html`<div class=${book.isSelected ? selected : notSelected}>
  <img  class="BookCard-icon" alt="${icon.summary}" src=${`/images/resize/240/0/${encodeURIComponent(getURL(icon.url))}`}>
  <div class="BookCard-group">
    <h4 class="BookCard-title"><a href="${url}" class="BookCard-link">${
  book.name
}</a></h4>
    <p class="BookCard-paragraph">${arrify(book.attributedTo).map((attribution, index) => html`<span class="BookCard-attribution">${
    attribution.name
  }</span>`)}</p>
    <p class="BookCard-total"></p>
  </div>
    <details class="MenuButton BookCard-menu">
  <summary class="MenuButton-summary App-button" aria-label="Library actions">⋮</summary>
  <details-menu role="menu" class="MenuButton-body MenuButton-body--right">
  <button role="menuitem" disabled class="MenuItem">Edit publication...</button>
  <button role="menuitem" disabled class="MenuItem">Delete publication...</button>
  <hr class="MenuButton-separator">
  ${arrify(tags).map(tag => (book = {}, dispatch) => {
    const selected = arrify(book.tags).map(tag => tag.id).indexOf(tag.id) !== -1
    let classList, label
    if (selected) {
      classList = 'MenuItem MenuItem--selected'
      label = `Remove ${tag.name}`
    } else {
      classList = 'MenuItem'
      label = `Add ${tag.name}`
    }
    return html`<button type="button" role="menuitem"  data-selected=${selected} data-component="book-tag-item" class="${classList}" data-tag-id=${tag.id} onclick="${(event) => sendEvent(event, dispatch)}" data-book-id="${book.id}" aria-label="${label}">${tag.name}</button>`
  })}
  </details-menu>
  </details>
</div>`
})

function getURL (url) {
  if (Array.isArray(url)) {
    return url[0].href
  } else {
    return url
  }
}

function sendEvent (event, dispatch) {
  const element = event.currentTarget
  const action = {
    dispatch,
    tag: {
      id: element.dataset.tagId,
      name: element.textContent
    },
    book: element.dataset.bookId
  }
  if (element.dataset.selected === 'true') {
    action.type = 'remove-from-collection'
  } else {
    action.type = 'add-to-collection'
  }
  return dispatch(action)
}
