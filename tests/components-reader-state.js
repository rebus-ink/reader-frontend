const tap = require('tap')
require('basichtml').init()
const {
  savePosition,
  calloutLocation,
  reading,
  loadBook,
  book,
  loadChapter,
  chapter,
  cacheBook
} = require('../app/reader/state.js')

// Test whether act.saveActivity is called with the id and location
tap.test('savePosition', test => {
  chapter.provide({ id: 'test-id' })
  let activity
  const act = {
    saveActivity (action) {
      activity = action
      return Promise.resolve()
    }
  }
  savePosition('/div/p/span', act)
  test.equals(activity.object.id, chapter.value.id)
  test.equals(activity['oa:hasSelector'].value, '/div/p/span')
  test.end()
})

// Test location !== position condition in savePosition
tap.test('savePosition - location === position', test => {
  chapter.provide({ id: 'test-id' })
  reading.provide({ savedPosition: '/div/p[0]/span' })
  let activity
  const act = {
    saveActivity (action) {
      activity = action
      return Promise.resolve()
    }
  }
  savePosition('/div/p[0]/span', act)
  test.notOk(activity)
  test.end()
})

// Test whether reading.provide has been called
tap.test('calloutLocation', test => {
  calloutLocation('/div/span')
  test.equals(reading.value.callout, '/div/span')
  test.end()
})

// Test whether reading.provide has been called
tap.test('calloutLocation - no value', test => {
  reading.provide({ savedPosition: '/div/p[0]/span' })
  calloutLocation()
  test.equals(reading.value.callout, '/div/p[0]/span')
  test.end()
})

// Test whether act.book has been called and whether book.provide provides
tap.test('loadBook', async test => {
  const bookData = {
    id: '/book-id',
    position: { documentId: '/document-id' },
    orderedItems: [
      { 'reader:path': 'bling/0', id: '/document-id0' },
      { mediaType: 'text/html', 'reader:path': 'bling/1', id: '/document-id' },
      { 'reader:path': 'bling/2', id: '/document-id2' }
    ]
  }
  let bookIdentifier
  const act = {
    book (bookId) {
      bookIdentifier = bookId
      return Promise.resolve(bookData)
    }
  }
  await loadBook('book-id', null, act, null)
  test.equals(bookIdentifier, 'book-id')
  test.equals(bookData.position.path, '/reader/book-id/bling/1?json=true')
  test.equals(book.value.id, '/book-id')
  test.end()
})

tap.test('loadBook - with path', async test => {
  const bookData = {
    id: '/book-id',
    position: { documentId: '/document-id' },
    orderedItems: [
      { mediaType: 'text/html', 'reader:path': 'bling/0', id: '/document-id0' },
      { mediaType: 'text/html', 'reader:path': 'bling/1', id: '/document-id' },
      { mediaType: 'text/html', 'reader:path': 'bling/2', id: '/document-id2' }
    ]
  }
  let bookIdentifier
  const act = {
    book (bookId) {
      bookIdentifier = bookId
      return Promise.resolve(bookData)
    }
  }
  await loadBook('book-id', 'bling/2', act, null)
  test.equals(bookIdentifier, 'book-id')
  test.equals(bookData.position.path, '/reader/book-id/bling/2?json=true')
  test.equals(bookData.position.documentId, '/document-id2')
  test.equals(book.value.id, '/book-id')
  test.end()
})

tap.test('loadBook - without position', async test => {
  const bookData = {
    id: '/book-id',
    orderedItems: [
      { mediaType: 'text/html', 'reader:path': 'bling/0', id: '/document-id0' },
      { mediaType: 'text/html', 'reader:path': 'bling/1', id: '/document-id' },
      { mediaType: 'text/html', 'reader:path': 'bling/2', id: '/document-id2' }
    ]
  }
  let bookIdentifier
  const act = {
    book (bookId) {
      bookIdentifier = bookId
      return Promise.resolve(bookData)
    }
  }
  await loadBook('book-id', null, act, null)
  test.equals(bookIdentifier, 'book-id')
  test.equals(bookData.position.path, '/reader/book-id/bling/0?json=true')
  test.equals(bookData.position.documentId, '/document-id0')
  test.equals(book.value.id, '/book-id')
  test.end()
})

// Test whether act.getChapter has been called and whether chapter.provide provides
tap.test('loadChapter', async test => {
  const chapterData = {
    mediaType: 'text/html',
    'reader:path': 'bling/0',
    id: '/document-id0'
  }
  let chapterPath
  const act = {
    getChapter (path) {
      chapterPath = path
      return Promise.resolve(chapterData)
    }
  }
  await loadChapter(
    { path: '/reader/book-id/bling/0?json=true', value: '/div/span' },
    act
  )
  test.equals(chapter.value.id, '/document-id0')
  test.equals(reading.value.savedPosition, '/div/span')
  test.equals(chapterPath, '/reader/book-id/bling/0?json=true')
  test.end()
})

// Test whether caches.open and cache.addAll have been called
tap.test('cacheBook', async test => {
  const bookData = {
    id: '/book-id',
    attachment: [
      { mediaType: 'text/html', 'reader:path': 'bling/0', id: '/document-id0' },
      { mediaType: 'text/html', 'reader:path': 'bling/1', id: '/document-id' },
      { mediaType: 'text/html', 'reader:path': 'bling/2', id: '/document-id2' }
    ]
  }
  let resources
  const cache = {
    addAll (cachedResources) {
      resources = cachedResources
      return Promise.resolve()
    }
  }
  const caches = {
    open () {
      return Promise.resolve(cache)
    }
  }
  await cacheBook(bookData, 'book-id', caches)
  test.matches(resources, [
    '/reader/book-id/bling/0?json=true',
    '/reader/book-id/bling/1?json=true',
    '/reader/book-id/bling/2?json=true',
    '/book-id'
  ])
  test.end()
})
