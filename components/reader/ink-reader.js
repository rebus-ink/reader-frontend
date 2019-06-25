import { html } from 'lit-html'
import { component, useState, useEffect, useContext } from 'haunted'
import { navigate } from '../hooks/useRoutes.js'
import { ApiContext } from '../api-provider.component.js'

export const Reader = el => {
  const { req } = el
  const api = useContext(ApiContext)
  const [book, setBook] = useState({ type: 'loading', json: {} })
  const { readingOrder = [] } = book
  useEffect(() => {
    if (req.params.bookId) {
      el.updateComplete = api.book
        .get(`/${req.params.bookId}`)
        .then(book => {
          setBook(book)
        })
        .catch(err => console.error(err))
    }
  }, [])
  let chapter, view
  if (book.type === 'loading') {
    view = () => html`<div class="Loading"></div>`
  } else if (book.json.epubVersion) {
    chapter = `/${req.params.bookId}/${readingOrder[0].url}`
    view = () => html`<ink-chapter  chapter=${chapter}></ink-chapter>`
  } else if (book.json.pdfInfo) {
    chapter = `/${req.params.bookId}/${readingOrder[0].url}`
    view = () => html`<ink-pdf chapter=${chapter}>
    <div><div id="viewer" class="pdfViewer">
      </div></div></ink-pdf>`
  }
  return html`<style>
  ink-reader {
    display: block;
    padding: 0;
  }
  reader-head {
    background-color: white;
    margin: 0;
    padding: 0.25rem 1rem;
    position: sticky;
    top: 0;
    max-height: 2rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    z-index: 2;
  }
  upload-section {
    display: block;
    padding: 1rem;
  }
  reader-head .Library-name {
    text-transform: uppercase;
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--medium);
  }
  </style><reader-head name=${book.name} .returnPath=${`/info/${
  req.params.bookId
}/`}></reader-head>
  ${view()}

<ink-collection-modal></ink-collection-modal>`
}
window.customElements.define(
  'ink-reader',
  component(Reader, window.HTMLElement, { useShadowDOM: false })
)

const ReaderHead = ({ name, returnPath }) => {
  return html`<style>
  
  :host {
    background-color: white;
    margin: 0;
    padding: 0.25rem 1rem;
    position: sticky;
    top: 0;
    max-height: 2rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    z-index: 2;
    grid-column: 1/-1
  }
  </style><icon-button @click=${ev => {
    navigate(returnPath)
  }} name="cancel">Menu Sidebar</icon-button> <span class="Library-name">${name}</span> <span></span>`
}
ReaderHead.observedAttributes = ['name']

window.customElements.define(
  'reader-head',
  component(ReaderHead, window.HTMLElement)
)
