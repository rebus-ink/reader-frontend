import { html } from 'lit-html'
import { component, useState, useEffect, useContext } from 'haunted'
import { navigate } from '../hooks/useRoutes.js'
import { ApiContext } from '../api-provider.component.js'

export const Info = el => {
  const { req } = el
  const api = useContext(ApiContext)
  const [book, setBook] = useState({ type: 'loading', json: {} })
  const { resources = [], author = [], readingOrder = [] } = book
  const coverResource = resources.filter(resource =>
    resource.rel.includes('cover')
  )[0]
  let original, format
  if (book.json.epubVersion) {
    format = 'epub'
    original = `/${req.params.bookId}/original.epub`
  } else if (book.json.pdfInfo) {
    format = 'pdf'
    original = `/${req.params.bookId}/original.pdf`
  }
  let cover
  if (coverResource) {
    const url = new URL(book.id, window.location).pathname
    cover = `${url}${coverResource.url}?cover=true`
  } else {
    cover = '/static/placeholder-cover.jpg'
  }
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
  const { position = {} } = book
  let bookURL, continued
  if (position.location && position.path) {
    continued = true
    bookURL = `/reader/${req.params.bookId}/${position.path}#${
      position.location
    }`
  } else if (resources[0]) {
    bookURL = `/reader/${req.params.bookId}/${readingOrder[0].url}`
  }
  console.log(book)
  return html`
  <style>
  ink-info {
    display: grid;
    grid-template-rows: 2rem auto;
    grid-template-columns: 1fr 1fr;
  }
  ink-info .Cover {
    padding: 1rem;
  }
  ink-info .Cover-icon {
    max-width: 40vw;
  }
  ink-info .actions {
    padding: 1rem;
  }
  ink-info ink-button {
    display: block;
    text-align:center;
    margin-bottom: 1rem;
  }
  </style>
  <info-head name=${book.name}></info-head>
  <div class="Cover">
  <img class="Cover-icon" alt="${book.description || ''}" src="${cover}">
  <div class="BookCard-group">
    <h4 class="BookCard-title">${book.name}</h4>
    <p class="BookCard-paragraph">${author.map(attributionComponent)}</p>
    <p class="BookCard-total"></p>
  </div></div><div class="actions">
    <a href="${bookURL}" class="Button">${continued ? 'Continue' : 'Read'}</a>
    <a href=${original} class="Button" download=${`${
  book.name
}.${format}`}>Download Original</a>
    <text-button dangerous @click=${ev => {
    const modal = document.getElementById('delete-publication')
    if (modal) {
      modal.open = true
    }
  }}>Delete</text-button>
  </div><ink-modal id="delete-publication" aria-hidden="true">
    <strong slot="modal-title" class="Modal-name">Delete Publication</strong>
    <confirm-action dangerous slot="modal-body" .action=${() => {
    return Promise.resolve()
      .then(() => {
        if (book) {
          return api.activity.delete(book)
        }
      })
      .then(() => {
        document.getElementById('delete-publication').closer = true
        return navigate('/library')
      })
  }} name="Delete" .view=${() =>
  html`<p>Are you sure you want to delete this publication?</p>`}></confirm-action></ink-modal>`
}

const attributionComponent = attribution => {
  return html`<span class="BookCard-attribution">${attribution.name}</span>`
}
window.customElements.define(
  'ink-info',
  component(Info, window.HTMLElement, { useShadowDOM: false })
)

const InfoHead = ({ name }) => {
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
    navigate('/library')
  }} name="cancel">Menu Sidebar</icon-button> <span class="Library-name">${name}</span> <span></span>`
}
InfoHead.observedAttributes = ['name']

window.customElements.define(
  'info-head',
  component(InfoHead, window.HTMLElement)
)
