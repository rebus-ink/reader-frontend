import { html } from 'lit-html'
import { component } from 'haunted'

export const title = 'Book Listing Component: `<book-listing>`'

export const description = `This is a book listing component used in the library and collection views.`

export const preview = () => {
  return html`<book-listing .book=${{
    name: 'Book Title',
    id: 'https://example.com/id',
    attributedTo: [{ name: 'Fancy Author' }]
  }}></book-listing>`
}

export const BookListing = component(({ book = {} }) => {
  const { cover = '/static/placeholder-cover.jpg', attributedTo = [] } = book
  const pathname = new URL(book.id).pathname
  const url = `/library/info${pathname}`
  return html`
    <style>
  :host() {
  grid-auto-rows: auto;
  grid-template-columns: max-content 1fr;
  grid-column-gap: 0.25rem;
  position: relative;
}

.BookCard-group {
  margin-right: 0;
}

.MenuButton.BookCard-menu {
  position: absolute;
  top: 0;
  right: 0;
}
.BookCard-menu .MenuButton-summary {
  font-weight: 600;
}

.BookCard-icon {
  font-size: 0.75rem;
  text-align: center;
  line-height: 7;
  text-transform: uppercase;
  color: #999;
  background-color: #f0f0f0;
  display: block;
  width: 100%;
  max-height: none;
  object-fit: cover;
  object-position: top left;
  width: 6rem;
  height: 8.5rem;
  border-radius: var(--border-radius);
}
.BookCard-title {
  margin: 0.25rem 0;
  padding: 0;
  font-weight: 750;
  font-size: 0.7rem;
  line-height: 1;
}

.BookCard-attribution {
  font-weight: 400;
  font-style: italic;
  text-decoration: none;
  color: #666;
}
.BookCard-attributionLabel {
  font-weight: 300;
  color: #888;
}
a.BookCard-link {
  text-decoration: none;
  font-weight: inherit;
  color: var(--dark);
}
.BookCard-paragraph {
  line-height: 0.75rem;
  font-weight: 300;
  margin-top: 0.25rem;
  font-size: 0.65rem;
  --local-font-size: 0.65rem;
}
.BookCard-paragraph--tags {
  margin-top: 0.5rem;
}
    </style>
    <a href="${url}" class="">
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
}, window.HTMLElement)

const attributionComponent = attribution => {
  return html`<span class="BookCard-attribution">${attribution.name}</span>`
}

window.customElements.define('book-listing', BookListing)