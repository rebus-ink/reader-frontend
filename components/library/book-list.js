import { html } from 'lit-html'
import { component } from 'haunted'
import { repeat } from 'lit-html/directives/repeat'
import './book-listing.js'

export const title = 'Book List Component: `<book-list>`'

export const description = `Given a list of books and a view config, renders that list.`

// http://localhost:8080/demo/?component=/components/library/book-list.js
export const preview = () => {
  const books = [
    {
      name: 'Book Title 1',
      id: 'https://example.com/id',
      attributedTo: [{ name: 'Fancy Author' }]
    },
    {
      name: 'Book Title 2',
      id: 'https://example.com/id',
      attributedTo: [{ name: 'Fancy Author' }]
    },
    {
      name: 'Book Title 3',
      id: 'https://example.com/id',
      attributedTo: [{ name: 'Fancy Author' }]
    },
    {
      name: 'Book Title 4',
      id: 'https://example.com/id',
      attributedTo: [{ name: 'Fancy Author' }]
    },
    {
      name: 'Book Title 5',
      id: 'https://example.com/id',
      attributedTo: [{ name: 'Fancy Author' }]
    },
    {
      name: 'Book Title 6',
      id: 'https://example.com/id',
      attributedTo: [{ name: 'Fancy Author' }]
    },
    {
      name: 'Book Title 7',
      id: 'https://example.com/id',
      attributedTo: [{ name: 'Fancy Author' }]
    },
    {
      name: 'Book Title 8',
      id: 'https://example.com/id',
      attributedTo: [{ name: 'Fancy Author' }]
    },
    {
      name: 'Book Title 9',
      id: 'https://example.com/id',
      attributedTo: [{ name: 'Fancy Author' }]
    },
    {
      name: 'Book Title 10',
      id: 'https://example.com/id',
      attributedTo: [{ name: 'Fancy Author' }]
    }
  ]
  return html`<book-list .books=${books}></book-list>`
}

export const BookList = component(({ books = [] }) => {
  return html`
    <style>
.list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(6rem, 0.5fr));
  grid-gap: 0.5rem;
  padding-bottom: 1rem;
}
book-listing {
  display: block;
}</style>
    <div class="list">
${repeat(
    books,
    item => item.id,
    (item, index) =>
      html`<book-listing .book=${item} index=${index}></book-listing>`
  )}
    </div>`
}, window.HTMLElement)

window.customElements.define('book-list', BookList)
