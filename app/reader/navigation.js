import DOMPurify from 'dompurify'
import component, {html, useState, useMemo} from 'neverland'
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
  const [nav, setState] = useState({content: ''})
  const clean = DOMPurify.sanitize(nav.content, purifyConfig)
  useMemo(() => {
    getNavigation(book, nav, setState)
  }, [book, setState])
  return html`<div class="Contents">${clean}</div>`
})

export async function getNavigation (book, oldNav, setState, act = activities) {
  console.log(book, oldNav)
  const {attachment = [], orderedItems = [], id = '/'} = book
  const path = new window.URL(id, window.location.href).pathname
  const html = attachment.filter(({rel = []}) => rel.includes('contents'))[0]
  const ncx = attachment.filter(({mediaType = ''}) => mediaType.includes('application/x-dtbncx+xml'))[0]
  const fallback = orderedItems
  console.log(html, ncx, fallback, attachment, orderedItems)
  if (html) {
    const url = makeChapterURL(path, html, true)
    console.log(url)
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
