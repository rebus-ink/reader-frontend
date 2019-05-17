import { html } from 'lit-html'
import { component } from 'haunted'

export const BookListing = component(
  ({ book = {} }) => {
    const { cover = '/static/placeholder-cover.jpg', attributedTo = [] } = book
    const pathname = new URL(book.id).pathname
    const url = `/library${pathname}`
    return html`<a href="${url}" class="">
    <img class="BookCard-icon" alt="${
  book.description
}" src="${`/images/resize/240/0/${encodeURIComponent(
  '/static/placeholder-cover.jpg'
)}`}" data-lazy-src=${`/images/resize/240/0/${encodeURIComponent(
  cover
)}`}></a>
    <div class="BookCard-group">
      <h4 class="BookCard-title"><a href="${url}" class="BookCard-link">${
  book.name
}</a></h4>
      <p class="BookCard-paragraph">${attributedTo.map(
    attributionComponent
  )}</p>
      <p class="BookCard-total"></p>
    </div>`
  },
  window.HTMLElement,
  { useShadowDOM: false }
)

const attributionComponent = attribution => {
  return html`<span class="BookCard-attribution">${attribution.name}</span>`
}

window.customElements.define('book-listing', BookListing)
