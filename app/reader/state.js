
import {createContext} from 'neverland'
import * as activities from '../state/activities.js'

// This should keep track of current book
// Route needs to reset context if bookIds don't match

export const book = createContext({type: 'initial-book'})

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

// Route component calls loadBook if there is no book or if it doesn't match the bookId (id doesn't include bookId)
// Then it should call loadChapter.
export async function loadBook (bookId, path, act = activities, caches = window.caches) {
  const bookData = await act.book(bookId) // does not need '/' prefix
  console.log('loadBook')
  if (path) {
    const chapter = bookData.orderedItems.filter(chapter => chapter['reader:path'] === path)[0]
    bookData.position = {
      documentId: chapter.id,
      path: makeChapterURL(bookId, chapter),
      resource: makeChapterURL(bookId, chapter, true)
    }
  } else if (bookData.position && bookData.position.documentId) {
    const chapter = bookData.orderedItems.filter(chapter => chapter.id === bookData.position.documentId)[0]
    bookData.position.path = makeChapterURL(bookId, chapter)
    bookData.position.resource = makeChapterURL(bookId, chapter, true)
  } else {
    bookData.position = {
      documentId: bookData.orderedItems[0].id,
      path: makeChapterURL(bookId, bookData.orderedItems[0], false),
      resource: makeChapterURL(bookId, bookData.orderedItems[0], true)
    }
  }
  book.provide(bookData)
}

// This should never be called before a book has been loaded
// This should fetch from /reader/pub-id/path to get complete chapter data with markup
export async function loadChapter (position, act = activities) {
  console.log('loadChapter')
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
