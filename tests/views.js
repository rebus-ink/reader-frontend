require = require('esm')(module) // eslint-disable-line
const tap = require('tap')
const render = require('viperhtml').wire

const { login } = require('../views/login.js')
tap.test('views - login', test => {
  test.doesNotThrow(login.bind(null, render))
  test.end()
})

const { bookCardView } = require('../views/book-card.js')
tap.test('views - bookCardView', test => {
  test.doesNotThrow(bookCardView.bind(null, () => render))
  test.end()
})
tap.test('views - bookCardView', test => {
  test.doesNotThrow(bookCardView.bind(null, () => render, {}))
  test.end()
})
tap.test('views - bookCardView with model', test => {
  test.doesNotThrow(
    bookCardView.bind(null, () => render, {
      name: 'Badass: Making Users Awesome',
      isSelected: true,
      cover: {
        width: 105,
        height: 162,
        url: 'https://hungry-leavitt-c793be.netlify.com/styles/cover2.jpg',
        summary: ''
      },
      length: 402,
      notes: [{}, {}, {}],
      highlights: [{}, {}, {}, {}, {}, {}],
      toc: '',
      tags: [{ name: '#computinghistory' }, { name: '#preservation' }],
      attributions: [
        { name: 'Kathy Sierra', roles: ['author'] },
        { name: 'Fakey McFakeson', roles: ['editor'] }
      ],
      sessions: [
        {
          start: 0,
          end: 300,
          published: '2018-09-30 14:18:49.98-04'
        }
      ]
    })
  )
  test.end()
})

const { navSidebarView } = require('../views/nav-sidebar.js')
tap.test('views - navSidebarView', test => {
  test.doesNotThrow(
    navSidebarView.bind(null, () => render, {}, { path: '/library' })
  )
  test.end()
})

const { pageBody: importPageBody } = require('../views/import-body.js')
tap.test('views - importPageBody', test => {
  test.doesNotThrow(
    importPageBody.bind(null, () => render, {}, { path: '/library' })
  )
  test.end()
})

const { pageBody: libraryBody } = require('../views/library-body.js')
tap.test('views - libraryBody', test => {
  test.doesNotThrow(
    libraryBody.bind(null, () => render, {}, { path: '/library' })
  )
  test.end()
})

const { libraryBooksView } = require('../views/library-books')
tap.test('views - libraryBooksView', test => {
  test.doesNotThrow(
    libraryBooksView.bind(
      null,
      () => render,
      { books: [{}] },
      { path: '/library' }
    )
  )
  test.end()
})

const { pageBody: notesPageBody } = require('../views/notes-body.js')
tap.test('views - notesPageBody', test => {
  test.doesNotThrow(
    notesPageBody.bind(null, () => render, {}, { path: '/library', params: {} })
  )
  test.end()
})

const { pageBody: settingsPageBody } = require('../views/settings-body.js')
tap.test('views - settingsPageBody', test => {
  test.doesNotThrow(
    settingsPageBody.bind(null, () => render, {}, { path: '/library' })
  )
  test.end()
})
