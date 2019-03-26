import {html} from 'lighterhtml'
import {arrify} from '../utils/arrify.js'
const notSelected = 'BookCard is-selectable'
const selected = 'BookCard is-selectable is-selected'

export function viewBook (book, tags) {
  const { icon = {} } = book
  if (!icon.url) {
    icon.url = '/static/placeholder-cover.jpg'
  }
  const pathname = new URL(book.id).pathname
  const url = `/reader${pathname}`
  return html`
<div class=${book.isSelected ? selected : notSelected}>
  <img  class="BookCard-icon" alt="${icon.summary}" src=${icon.url}>
  <div class="BookCard-group">
    <h4 class="BookCard-title"><a href="${url}" class="BookCard-link">${
  book.name
}</a></h4>
    <p class="BookCard-paragraph">${attributionsMap(
    book.attributedTo
  )}</p>
    <p class="BookCard-total"></p>
  </div>
    <details class="MenuButton BookCard-menu">
  <summary class="MenuButton-summary App-button" aria-label="Library actions">⋮</summary>
  <details-menu role="menu" class="MenuButton-body MenuButton-body--right">
  <button role="menuitem" disabled class="MenuItem">Edit publication...</button>
  <button role="menuitem" disabled class="MenuItem">Delete publication...</button>
  <hr class="MenuButton-separator">
  ${arrify(tags).map(tag => tagList(tag, book))}
  </details-menu>
  </details>
</div>`
}

function tagList (tag, book) {
  const selected = arrify(book.tags).map(tag => tag.id).indexOf(tag.id) !== -1
  let classList, label
  if (selected) {
    classList = 'MenuItem MenuItem--selected'
    label = `Remove ${tag.name}`
  } else {
    classList = 'MenuItem'
    label = `Add ${tag.name}`
  }
  return html`<button type="button" role="menuitem"  data-selected=${selected} data-component="book-tag-item" class="${classList}" data-tag-id=${tag.id} onclick="${sendEvent}" data-book-id="${book.id}" aria-label="${label}">${tag.name}</button>`
}

function sendEvent (event) {
  const element = event.currentTarget
  const detail = {
    tag: {
      id: element.dataset.tagId,
      name: element.textContent
    },
    book: element.dataset.bookId
  }
  let eventName
  if (element.dataset.selected === 'true') {
    eventName = 'reader:remove-from-collection'
  } else {
    eventName = 'reader:add-to-collection'
  }
  document.body.dispatchEvent(
    new window.CustomEvent(eventName, {
      detail
    })
  )
}

function attributionsMap (attributions = []) {
  attributions = arrify(attributions)
  return attributions.map((attribution, index) => {
    return html`<span class="BookCard-attribution">${
      attribution.name
    }</span>`
  })
}
