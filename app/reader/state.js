
import {createContext} from 'neverland'
import {errorEvent} from '../utils/error-event.js'
import * as activities from '../state/activities.js'

// This should keep track of current book
// Route needs to reset context if bookIds don't match

const book = createContext({type: 'initial-book'})

const chapter = createContext({type: 'initial-notes', position: {}})

const reading = createContext({type: 'initial-location'})

// We need loadBook, loadNotes, setLocation, and calloutLocation

// Called when active->passive lifecycle change and when route component is disconnected
export function savePosition (location, act = activities) {
  const {position} = reading.value
  if (location !== position) {
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
      reading.provide({...reading.value, position: location})
    }).catch(err => console.error(err))
  }
}

// Called by add bookmark and add anchor buttons when highlighted or focused
// Call without argument to call out current location. Call with null or falsey value to end call out.
export function calloutLocation (location) {
  const {position} = reading.value
  if (location === undefined) {
    reading.provide({...reading.value, callout: position})
  } else {
    reading.provide({...reading.value, callout: location})
  }
}

// Route component calls loadBook if there is no book or if it doesn't match the bookId (id doesn't include bookId)
// Then it should call loadChapter.
export async function loadBook (bookId, path, act = activities, caches = window.caches) {
  try {
    const bookData = await act.book(bookId) // does not need '/' prefix
    if (path) {
      bookData.position = {
        documentId: book.value.orderedItems.filter(chapter => chapter['reader:path'] === path)[0].id,
        path: `/reader/${bookId}/${path}`
      }
    } else if (bookData.position) {
      const chapter = book.value.orderedItems.filter(chapter => chapter.id === bookData.position.documentId)[0]
      bookData.position.path = makeChapterURL(bookId, chapter)
    } else {
      bookData.position = {
        documentId: book.value.orderedItems[0].id,
        path: makeChapterURL(bookId, book.value.orderedItems[0])
      }
    }
    book.provide(bookData)
    if (caches) return cacheBook(bookData, bookId, caches)
  } catch (err) {
    return errorEvent(err)
  }
}

// This should never be called before a book has been loaded
// This should fetch from /reader/pub-id/path to get complete chapter data with markup
export async function loadChapter (position, act = activities) {
  if (!position) return
  try {
    const data = await act.getChapter(position.path) // Needs full URL
    chapter.provide(data)
  } catch (err) {
    return errorEvent(err)
  }
}

async function cacheBook (book, bookId, caches = window.caches) {
  // This should filter out video resources
  const resources = book.attachment.map((resource) => makeChapterURL(bookId, resource)).concat('/' + bookId)
  const bookResources = await caches.open('book-resources')
  await bookResources.addAll(resources)
}

function makeChapterURL (bookId, chapter = {}, json) {
  if (chapter.mediaType === 'text/html' || chapter.mediaType === 'application/xhtml+xml') {
    json = true
  }
  return `/reader/${bookId}/${chapter['reader:path']}${json ? '?json=true' : ''}`
}
