
import component, {useContext, useEffect, html} from 'neverland'
import {Reader} from './component-reader.js'
import {topMenu, bottomMenu} from './menus.js'
import './location.js'
import {book, reading, chapter, savePosition, toggleCallout, loadBook, loadChapter} from './state.js'
import {getNavigation} from './navigation.js'

const name = 'reader'
const path = '/reader/:readerBookId/:bookPath*'
const root = '#reader'
const render = component((context, h) => {
  console.log('reader render called')
  const bookState = useContext(book)
  const {position = {}} = bookState
  const chapterState = useContext(chapter)
  const readingState = useContext(reading)
  context.book = bookState
  context.chapter = chapterState
  context.reading = readingState
  context.location = position.value
  const {params} = context.request
  const rootEl = document.querySelector(root)
  if (readingState.callout) {
    rootEl.dataset.callout = readingState.callout
  }
  if (rootEl.dataset.active) {
    useEffect(() => {
      loadBook(params.readerBookId, params.bookPath)
        .catch(err => {
          console.error(err.url)
          console.error(err)
        })
    }, [bookState.type, params.readerBookId, params.bookPath])
    useEffect(() => {
      if (bookState.position.resource) {
        loadChapter(bookState.position).catch(err => {
          console.error(err.url, bookState.position)
          console.error(err)
        })
      }
    }, [bookState.position, params.bookPath])
  }
  h.provides('savePosition', savePosition)
  h.provides('toggleCallout', toggleCallout)
  document.querySelector(root).setAttribute('class', 'App ' + `${name}-container`)
  const mainList = `${name} App-main`
  const leftList = `${name}-left` // This should be an aside
  const rightList = `${name}-right`
  const menuList = `${name}-menu App-menu App-menu--center`
  const bottomMenuList = `${name}-menu App-menu App-menu--bottom App-menu App-menu--center`
  return html`
  <nav class="${leftList}" id="reader-contents" data-root=${root} data-sidebar></nav>
  <nav class="${menuList}">${topMenu(context, h)}</nav>
  <aside class="${rightList}" id="reader-notes" data-root=${root} data-sidebar></aside>
  <main class="${mainList}" id="main">${Reader(context, h)}</main>
  <nav class="${bottomMenuList}">${bottomMenu(context, h)}</nav>
  <div id="modal-reader" class="Modal" aria-hidden="true">
    <div tabindex="-1" data-micromodal-close class="Modal-overlay">
      <div role="dialog" class="Modal-container" aria-modal="true" aria-labelledby="modal-1-title" >
        <header>
          <h2 id="modal-1-title" class="Modal-title">${''}
          </h2>
          <button aria-label="Close modal" data-micromodal-close class="Modal-close App-button">&times;</button>
        </header>
        <div id="modal-1-content" class="Modal-content">${''}
        </div>
      </div>
    </div>
  </div>`
})

const route = {
  root,
  path,
  name,
  render
}

export default route
