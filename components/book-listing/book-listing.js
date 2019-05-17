const notSelected = 'BookCard is-selectable'
const selected = 'BookCard is-selectable is-selected'

function getURL (url) {
  if (Array.isArray(url)) {
    return url[0].href
  } else {
    return url
  }
}

export function BookListing (element, html) {
  const { book = {} } = element
  const { icon = {} } = book
  if (!icon.url) {
    icon.url = '/static/placeholder-cover.jpg'
  }
  const pathname = new URL(book.id).pathname
  const url = `/library${pathname}`
  return html`<div class=${book.isSelected ? selected : notSelected}>
  <div class="BookCard-group">
    <h4 class="BookCard-title"><a href="${url}" class="BookCard-link">${
  book.name
}</a></h4>
    <p class="BookCard-paragraph"></p>
    <p class="BookCard-total"></p>
  </div>
</div>`
}
