import { fetchWrap, get } from './fetch.js'
import DOMPurify from 'dompurify'
import { html } from 'lit-html'

export function createBookAPI (context, api, global) {
  return {
    // Returns sanitised DOM for chapter
    get chapter () {
      return url => getChapter(url)
    },
    // Return the publication object
    async get (bookId, path) {
      const url = `/${bookId}`
      let data
      if (context.books.get(url)) {
        data = context.books.get(url)
      } else {
        data = await get(url, context, global)
        context.books.set(url, data)
      }
      return data
    },
    // Load a given chapter, falling back to first or current chapter
    async load (book, path) {
      if (path) {
        return this.chapter(`${book.id}/${path}`)
      } else if (book.position && book.position.path) {
        return this.chapter(`${book.id}/${book.position.path}`)
      } else {
        const chapter = book.readingOrder[0]
        return this.chapter(`${book.id}/${chapter.url}`)
      }
    },
    savePosition (publication, path, newLocation) {
      const activity = {
        type: 'Read',
        context: publication.id
      }
      if (newLocation) {
        activity['oa:hasSelector'] = {
          type: 'reader:Location',
          location: newLocation,
          path
        }
      }
      return api.activity.save(activity)
    },
    async notes (book, path, page = 1) {
      const notesURL = `${
        context.profile.id
      }/notes?limit=100&page=${page}&document=${`${book.id}/${path}`}`
      try {
        let notes = await get(notesURL)
        while (notes.items.length <= notes.totalItems) {
          page = page + 1
          const newNotes = await get(
            `${context.profile.id}/notes?limit=100&page=${page}&document=${`${
              book.id
            }/${path}`}`
          )
          notes.items = notes.items.concat(newNotes.items)
        }
        return notes
      } catch (err) {
        console.error(err)
      }
    },
    // Returns sanitised DOM for navigation, generating if necessary
    async navigation (book) {
      const { resources = [] } = book
      const navResource = resources.filter(resource =>
        resource.rel.includes('cover')
      )[0]
      if (navResource) {
        const navURL = `${book.id}/${navResource.url}`
        return this.chapter(navURL)
      } else {
        return html`<ol class="Contents-list">${book.readingOrder.map(
          (resource, index) => {
            if (!resource.name) {
              resource.name = `Chapter ${index + 1}`
            }
            return html`<li class="Contents-item"><a  class="Contents-link" href=${`/reader${
              book.id
            }/${resource.url}`}>${resource.name}</a></li>`
          }
        )}</ol>`
      }
    }
  }
}

export async function getChapter (url) {
  const response = await fetchWrap(url, {
    credentials: 'include'
  })
  const chapter = await response.text()
  return processChapter(chapter, url)
}

const purifyConfig = {
  KEEP_CONTENT: false,
  RETURN_DOM: true,
  RETURN_DOM_FRAGMENT: true,
  RETURN_DOM_IMPORT: true,
  FORBID_TAGS: ['style', 'link'],
  FORBID_ATTR: ['style']
}

export function processChapter (chapter, base) {
  let locationNumber = 0
  const clean = DOMPurify.sanitize(chapter, purifyConfig)
  clean.querySelectorAll('[id]').forEach(element => {
    element.id = `${base}#${element.id}`
  })
  const symbols = clean.querySelectorAll(
    'p, h1, h2, h3, h4, h5, h6, li, table, dd, dt, div > img:only-child, figure > img'
  )
  symbols.forEach(element => {
    if (element.tagName.toLowerCase() === 'img') {
      element = element.parentElement
    }
    element.dataset.location = true
    if (!element.id) {
      element.id = `${base}:${locationNumber}`
      locationNumber = locationNumber + 1
    } else {
      element.id = `${base}:${element.id}`
    }
  })
  clean.querySelectorAll('a[href]').forEach(element => {
    const href = element.getAttribute('href')
    const baseHost = new URL(base).host
    try {
      const { pathname, hash, host } = new URL(href, base)
      if (host === baseHost) {
        element.setAttribute(
          'href',
          `/reader${pathname}#${base}:${hash.slice(1)}`
        )
      }
    } catch (err) {
      console.error(err)
    }
  })
  clean.querySelectorAll('[src]').forEach(element => {
    const src = element.getAttribute('src')
    try {
      const path = new URL(src, base).pathname
      element.setAttribute('src', path)
    } catch (err) {
      console.error(err)
    }
  })
  return clean
}
