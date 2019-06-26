import { html } from 'lit-html'
import { component, useState, useEffect, useContext } from 'haunted'
import { ApiContext } from '../api-provider.component.js'
import lifecycle from 'page-lifecycle/dist/lifecycle.mjs'
import '../widgets/icon-link.js'
import './reader-head.js'
import './contents-modal.js'

export const Reader = el => {
  const { req, route } = el
  console.log(req, route)
  const api = useContext(ApiContext)
  const [book, setBook] = useState({
    type: 'loading',
    json: {},
    name: '',
    readingOrder: []
  })
  useEffect(
    () => {
      if (req.params.bookId && book.bookId !== req.params.bookId) {
        el.updateComplete = api.book
          .get(`/${req.params.bookId}`)
          .then(book => {
            book.bookId = req.params.bookId
            setBook(book)
          })
          .catch(err => console.error(err))
      }
    },
    [req]
  )
  useEffect(
    () => {
      function handleLifeCycle (event) {
        const root = document.querySelector('ink-chapter, ink-pdf')
        const current = root.getAttribute('current')
        const chapter = root.getAttribute('chapter')
        if (
          lifecycle.state === 'passive' &&
          event.oldState === 'active' &&
          current
        ) {
          api.book.savePosition(book, chapter, current)
        }
        console.log(book.id, chapter, current)
      }
      lifecycle.addEventListener('statechange', handleLifeCycle)
      return () => {
        lifecycle.removeEventListener('statechange', handleLifeCycle)
      }
    },
    [book]
  )
  let chapter, view, location
  if (req.params.bookPath) {
    chapter = `/${req.params.bookId}/${req.params.bookPath}`
    location = req.hash.replace('#', '')
  } else if (book.navigation && book.navigation.current) {
    chapter = book.navigation.current.path
    location = book.navigation.current.location
  }
  if (book.type === 'loading') {
    view = () => html`<div class="Loading"></div>`
  } else if (book.json.epubVersion) {
    view = () =>
      html`<ink-chapter  chapter=${chapter} location=${location}></ink-chapter>`
  } else if (book.json.pdfInfo) {
    view = () => html`<ink-pdf chapter=${chapter} location=${location}>
    <div><div id="viewer" class="pdfViewer">
      </div></div></ink-pdf>`
  }
  let navigation
  if (book.id) {
    navigation = addNav(book, req.params.bookId, req.params.bookPath)
  }
  let previous, next
  if (navigation && navigation.previous) {
    previous = `/reader${navigation.previous.path}`
  }
  if (navigation && navigation.next) {
    next = `/reader${navigation.next.path}`
  }
  book.navigation = navigation
  return html`<style>
  ink-reader {
    background-color: white;
    display: block;
    padding: 0;
    --reader-left-margin: 32px;
  }
  upload-section {
    display: block;
    padding: 1rem;
  }
  </style><reader-head name=${book.name} .returnPath=${`/info/${
  req.params.bookId
}/`} .book=${book} .current=${req.params.bookPath}></reader-head>
  ${view()}
<nav class="Reader-menu App-menu App-menu--bottom App-menu App-menu--center">
  <ol class="App-menu-list">
  <li>${
  previous
    ? html`
    <icon-link name="left-chevron" label="Previous" href=${previous}></icon-link>`
    : ''
}</li>
    <li></li>${
  next
    ? html`
    <icon-link name="right-chevron" label="Previous" href=${next}></icon-link>`
    : ''
}</li>
  </ol>
</nav>`
}
window.customElements.define(
  'ink-reader',
  component(Reader, window.HTMLElement, { useShadowDOM: false })
)

function addNav (book, bookId, bookPath) {
  const rootPath = new URL(book.id).pathname
  const navigation = {}
  const index = book.readingOrder
    .map(item => `${rootPath}${item.url}`)
    .indexOf(`/${bookId}/${bookPath}`)
  const nextItem = book.readingOrder[index + 1]
  if (nextItem) {
    navigation.next = {
      path: `${rootPath}${nextItem.url}`
    }
  }
  const prevItem = book.readingOrder[index - 1]
  if (prevItem) {
    navigation.previous = {
      path: `${rootPath}${prevItem.url}`
    }
  }
  return navigation
}
