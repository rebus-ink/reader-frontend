import {html} from 'lighterhtml'
const notSelected = 'BookCard is-selectable'
const selected = 'BookCard is-selectable is-selected'

export function bookCard (book) {
  const { icon = {} } = book
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
    <p class="BookCard-paragraph BookCard-paragraph--tags">
    </p>
    <p class="BookCard-total"></p>
  </div>
</div>`
}

function attributionsMap (attributions = []) {
  return attributions.map((attribution, index) => {
    return html`<span class="BookCard-attribution">${
      attribution.name
    }</span>`
  })
}
