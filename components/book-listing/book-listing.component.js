import { render, html } from 'lit-html'
import { component } from 'haunted'

const notSelected = 'BookCard is-selectable'
const selected = 'BookCard is-selectable is-selected'

function getURL (url) {
  if (Array.isArray(url)) {
    return url[0].href
  } else {
    return url
  }
}

export const BookListing = component(
  ({ book = {} }) => {
    const { icon = {} } = book
    if (!icon.url) {
      icon.url = '/static/placeholder-cover.jpg'
    }
    const pathname = new URL(book.id).pathname
    const url = `/library${pathname}`
    console.log('do we get here?')
    return html`<div>${book.name + url}</div>`
  },
  window.HTMLElement,
  { useShadowDOM: false }
)

window.customElements.define('book-listing', BookListing)

render(
  html`<book-listing .book=${{
    name: 'Book Title',
    id: 'https://example.com/id'
  }}></book-listing>`,
  document.body
)
console.log(document.body.innerHTML)
