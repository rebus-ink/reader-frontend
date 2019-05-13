
import {createContext} from 'neverland'
import * as activities from '../state/activities.js'

// This should keep track of current book
// Route needs to reset context if bookIds don't match
export const initialBook = {type: 'initial-book', id: '', position: {}}

export const book = createContext(initialBook)

export const chapter = createContext({type: 'initial-chapter', position: {}})

export const reading = createContext({type: 'initial-location'})

// We need loadBook, loadNotes, setLocation, and calloutLocation
// We also need saveHighlight, removeHighlight, saveNote, updateNote, removeNote

// Called when active->passive lifecycle change and when route component is disconnected
export function savePosition (location, act = activities) {
  const {savedPosition} = reading.value
  if (location !== savedPosition) {
    return act.saveActivity({
      type: 'Read',
      object: {
        type: 'Document',
        id: chapter.value.id
      },
      'oa:hasSelector': {
        type: 'XPathSelector',
        value: location
      }
    }).then(() => {
      reading.provide({...reading.value, savedPosition: location})
    })
  }
}

// Called by add bookmark and add anchor buttons when highlighted or focused
// Call without argument to call out current location. Call with null or falsey value to end call out.
export function calloutLocation (location) {
  const {savedPosition} = reading.value
  if (location === undefined) {
    reading.provide({...reading.value, callout: savedPosition})
  } else {
    reading.provide({...reading.value, callout: location})
  }
}

function getNext (bookId, items, current) {
  const index = items.indexOf(current)
  if (items[index + 1]) {
    return makeChapterURL(bookId, items[index + 1])
  }
}
function getPrevious (bookId, items, current) {
  const index = items.indexOf(current)
  if (items[index - 1]) {
    return makeChapterURL(bookId, items[index - 1])
  }
}

// Route component calls loadBook if there is no book or if it doesn't match the bookId (id doesn't include bookId)
// Then it should call loadChapter.
export async function loadBook (bookId, path, act = activities, caches = window.caches) {
  const bookData = await act.book(bookId) // does not need '/' prefix
  console.log('loadBook')
  let chapter
  if (path) {
    chapter = bookData.orderedItems.filter(chapter => chapter['reader:path'] === path)[0]
    bookData.position = {
      documentId: chapter.id,
      path: makeChapterURL(bookId, chapter),
      resource: makeChapterURL(bookId, chapter, true)
    }
  } else if (bookData.position && bookData.position.documentId) {
    chapter = bookData.orderedItems.filter(chapter => chapter.id === bookData.position.documentId)[0]
    bookData.position.path = makeChapterURL(bookId, chapter)
    bookData.position.resource = makeChapterURL(bookId, chapter, true)
  } else {
    chapter = bookData.orderedItems[0]
    bookData.position = {
      documentId: bookData.orderedItems[0].id,
      path: makeChapterURL(bookId, bookData.orderedItems[0], false),
      resource: makeChapterURL(bookId, bookData.orderedItems[0], true)
    }
  }
  bookData.previous = getPrevious(bookId, bookData.orderedItems, chapter)
  bookData.next = getNext(bookId, bookData.orderedItems, chapter)
  book.provide(bookData)
  // if (caches) return cacheBook(bookData, bookId, caches).catch(err => console.error(err))
}

// This should never be called before a book has been loaded
// This should fetch from /reader/pub-id/path to get complete chapter data with markup
export async function loadChapter (position, act = activities) {
  if (!position) return
  const data = await act.getChapter(position.resource) // Needs full URL
  chapter.provide(data)
  if (position.value) {
    reading.provide({...reading.value, savedPosition: position.value})
  }
}

function makeChapterURL (bookId, chapter = {}, json) {
  // The below doesn't work as only Web Pub LinkResources have mediatypes.
  if (chapter.mediaType === 'text/html' || chapter.mediaType === 'application/xhtml+xml') {
    json = true
  }
  return `/reader/${bookId}/${chapter['reader:path']}${json ? '?json=true' : ''}`
}

export async function cacheBook (book, bookId, caches = window.caches) { // Could use link[rel=preload] here instead
  // This should filter out video resources
  const resources = book.orderedItems.map((resource) => makeChapterURL(bookId, resource, true))
  const bookResources = await caches.open('book-resources')
  await bookResources.addAll(resources)
}
