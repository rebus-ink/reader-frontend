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

export const BookList = ({ books = [], layout = 'covers' }) => {
  return html`
    <style>
.covers, .square, .list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(6rem, 0.5fr));
  grid-gap: 0.5rem;
  padding-bottom: 1rem;
}
.square {
  padding: 0;
  grid-gap: 1px;
  grid-auto-rows: 1fr;
  grid-template-columns: repeat(auto-fill, 6rem);
}
.list {
  padding: 0;
  grid-gap: 1px;
  grid-template-columns: 1fr;
}
book-listing {
  display: block;
}</style>
    <div class=${layout}>
${repeat(
    books,
    item => item.id,
    (item, index) =>
      html`<book-listing .book=${item} index=${index} layout=${layout}></book-listing>`
  )}
    </div>`
}

BookList.observedAttributes = ['layout']

window.customElements.define(
  'book-list',
  component(BookList, window.HTMLElement)
)
