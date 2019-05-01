
import component, {useContext, html} from 'neverland'
import {Reader} from './component-reader.js'
import {topMenu, bottomMenu} from './menus.js'
import {book, reading, chapter, savePosition, calloutLocation, loadBook, loadChapter} from './state.js'

const name = 'reader'
const path = '/reader/:bookId/:bookPath*'
const root = '#reader'
const render = component((context, h) => {
  console.log('reader render called')
  const bookState = useContext(book)
  const chapterState = useContext(chapter)
  const readingState = useContext(reading)
  context.book = bookState
  context.chapter = chapterState
  context.reading = readingState
  const {params, pathname} = context.request
  const rootEl = document.querySelector(root)
  if (rootEl.dataset.active) {
    if (bookState.type === 'initial-book') {
      loadBook(params.bookId, params.bookPath)
    }
    if (bookState.position && chapterState.type === 'initial-chapter') {
      loadChapter(bookState.position)
    }
    // if (rootEl.dataset.active && bookState.position && bookState.position.path && pathname !== bookState.position.path) {
    //   console.log(bookState.position)
    //   h.navigate(bookState.position.path)
    // }
  }
  h.provides('savePosition', savePosition)
  h.provides('calloutLocation', calloutLocation)
  document.querySelector(root).setAttribute('class', 'App ' + `${name}-container`)
  const mainList = `${name} App-main`
  const leftList = `${name}-left App-sidebar App-sidebar--left` // This should be an aside
  const rightList = `${name}-right App-sidebar App-sidebar--right`
  const menuList = `${name}-menu App-menu App-menu--center`
  const bottomMenuList = `${name}-menu App-menu App-menu--bottom App-menu App-menu--center`
  return html`
  <nav class="${leftList}" id="left-sidebar"></nav>
  <nav class="${menuList}">${topMenu(context, h)}</nav>
  <aside class="${rightList}" id="right-sidebar"></aside>
  <main class="${mainList}" id="main">${Reader(context, h)}</main>
  <nav class="${bottomMenuList}">${bottomMenu(context, h)}</nav>
  <div id="modal-1" class="Modal" aria-hidden="true">
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
