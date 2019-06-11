import { html } from 'lit-html'
import { component, useEffect, useContext, useState } from 'haunted'
import { classMap } from 'lit-html/directives/class-map.js'
import { ApiContext } from '../api-provider.component.js'
import { createAPI } from '../api.state.js'
import './book-list.js'

export const title = 'Recent books: `<recent-books>`'

export const description = `Ten most recent books for any given tag.`

// http://localhost:8080/demo/?component=/components/library/recent-books.js
export const preview = () => {
  const api = createAPI()
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
  api.library = params => {
    return Promise.resolve({ items: books })
  }
  return html`<api-provider .value=${api}><recent-books></book-listing></api-provider>`
}

export const RecentBooks = component(
  ({ tag = 'all' }) => {
    const api = useContext(ApiContext)
    const [books, setBooks] = useState([])
    useEffect(() => {
      let params
      if (tag !== 'all') {
        params = { stack: tag }
      }
      api.library(params).then(collection => setBooks(collection.items))
      api.events.on('library', () => {
        return api
          .library(params)
          .then(collection => setBooks(collection.items))
      })
    }, [])
    const url = `/library/collection/${tag}`
    return html`<style>
    .header-row {
      display: flex;
      justify-content: space-between;
      align-content: center;
      min-height: 30px;
      margin-bottom: 0.5rem;
    }
    .label {
      font-size: 0.8rem;
      text-transform: uppercase;
      color: var(--medium);
      margin: 0;
      margin-top: 0.25rem;
    }
    .link {
      font-size: 0.8rem;
      margin: 0;
      margin-top: 0.25rem;
    }
    .link a {
      text-decoration: none;
    }
  </style><div class=${classMap({
    'header-row': true
  })}><p class="label">Recently uploaded ${
  tag === 'all' ? '' : `in ${tag}`
}</p> <p class="link">
    <a href=${url}>See all &gt;</a>
  </p></div><book-list .books=${books}></book-list>`
  },
  window.HTMLElement,
  { useShadowDOM: false }
)

window.customElements.define('recent-books', RecentBooks)
