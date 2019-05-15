import DOMPurify from 'dompurify'
import component, {html, useState, useRef, useMemo} from 'neverland'
import * as activities from '../state/activities.js'

const purifyConfig = {
  KEEP_CONTENT: false,
  RETURN_DOM: true,
  RETURN_DOM_FRAGMENT: true,
  RETURN_DOM_IMPORT: true,
  FORBID_TAGS: ['style', 'link', 'h1', 'h2'],
  FORBID_ATTR: ['style'],
  ADD_TAGS: ['reader-markers']
}

export const Navigation = component((book) => {
  console.log('Navigation render')
  const [nav, setState] = useState({content: ''})
  const clean = DOMPurify.sanitize(nav.content, purifyConfig)
  useMemo(() => {
    getNavigation(book, nav, setState)
  }, [book, setState])
  return html`<div class="Contents">${clean}</div>`
})

export const NavButton = component(({book, request}) => {
  const root = document.getElementById('reader')
  const {params} = request
  const menuEl = useRef(null)
  const buttonEl = useRef(null)
  let expanded
  if (root) {
    if (root.dataset.toggleLeft === 'show') {
      expanded = true
    } else {
      expanded = false
    }
    if (root.style.getPropertyValue('--left-library-sidebar-width') === '0px') {
      expanded = false
    }
  }
  const context = {menuEl, buttonEl, root}
  const library = `/library/${params.readerBookId}`
  return html`<li>
  <button ref="${buttonEl}" aria-expanded="${expanded}" class="App-button" aria-label="Show left sidebar" onclick=${(event) => toggleMenu(event, context)}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg></button>
  <div hidden="${!expanded}" ref=${menuEl} class="App-sidebar App-sidebar--left">
  <div class="App-menu"><ol class="App-menu-list"><li></li><li><h1 class="App-title">Contents</h1></li><li></li></ol></div>
  <p class="App-nav-label"><a href="${library}" class="App-button App-button--return">Return to Library</a></p>
  ${Navigation(book)}
  </div>
</li>`
})

function toggleMenu (event, {menuEl, buttonEl, root}) {
  buttonEl.current.setAttribute('aria-expanded', menuEl.current.hidden)
  menuEl.current.hidden = !menuEl.current.hidden
  if (menuEl.current.hidden) {
    root.dataset.toggleLeft = 'hide'
  } else {
    root.dataset.toggleLeft = 'show'
  }
}

export async function getNavigation (book, oldNav, setState, act = activities) {
  console.log('Navigation get')
  const {attachment = [], orderedItems = [], id = '/'} = book
  const path = new window.URL(id, window.location.href).pathname
  const html = attachment.filter(({rel = []}) => rel.includes('contents'))[0]
  const ncx = attachment.filter(({mediaType = ''}) => mediaType.includes('application/x-dtbncx+xml'))[0]
  const fallback = orderedItems
  if (html) {
    const url = makeChapterURL(path, html, true)
    if (oldNav.id !== html.id) {
      const data = await act.getChapter(url) // Needs full URL
      setState(data)
    }
  } else {
    const data = {
      id: 'fallback-navigation',
      content: `<ol class="Contents-list">${fallback.map((chapter, index) => {
        if (!chapter.name) {
          chapter.name = `Chapter ${index + 1}`
        }
        chapter.href = makeChapterURL(path, chapter, false)
        return `<li class="Contents-item"><a  class="Contents-link" href="${chapter.href}">${chapter.name}</a></li>`
      }).join('')}</ol>`
    }
    setState(data)
  }
}

function makeChapterURL (bookId, chapter = {}, json) {
  return `/reader${bookId}/${chapter['reader:path']}${json ? '?json=true' : ''}`
}
