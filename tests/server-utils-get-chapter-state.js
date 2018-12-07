const tap = require('tap')
const proxyquire = require('proxyquire')
if (!process.env.DOMAIN) {
  process.env.DOMAIN = process.env.BASE + '/api/'
}
let returnData = {
  '@context': [
    'https://www.w3.org/ns/activitystreams',
    { reader: 'https://rebus.foundation/ns/reader' }
  ],
  type: 'reader:Publication',
  id: `https://example.com/publication/0`,
  name: `Publication 0`,
  attributedTo: {
    type: 'Person',
    name: 'Sample Author'
  },
  totalItems: 4,
  orderedItems: [
    {
      type: 'Document',
      id: `https://example.com/publication/0/document/1`,
      name: 'Chapter 1'
    },
    {
      type: 'Document',
      id: `https://example.com/publication/0/document/2`,
      name: 'Chapter 2'
    },
    {
      type: 'Document',
      id: `https://example.com/publication/0/document/3`,
      name: 'Chapter 3'
    },
    {
      type: 'Document',
      id: `https://example.com/publication/0/document/4`,
      name: 'Chapter 4'
    }
  ]
}
const fakeGot = () => {
  return returnData
}
let returnChapter = {
  type: 'Document',
  id: `https://example.com/publication/0/document/1`,
  name: 'Chapter 1',
  content: '<p>Content!</p>'
}
const fakeChapterGot = () => {
  return returnChapter
}
const stubs = {
  './get-book-state.js': { getBookState: fakeGot },
  './api-get.js': { get: fakeChapterGot }
}
const { getChapterState } = proxyquire(
  '../server/utils/get-chapter-state.js',
  stubs
)
const httpMocks = require('node-mocks-http')

tap.test('get-chapter-state', async function (test) {
  const request = httpMocks.createRequest({
    method: 'GET',
    url: '/reader/0/0',
    session: { id: 'thing' },
    query: { first: true },
    params: {
      bookId: 0,
      chapter: 0
    }
  })
  request.user = { token: 'thing' }
  const response = httpMocks.createResponse()
  const result = await getChapterState(request, response)
  test.equals(result.book.name, 'Publication 0')
  test.equals(result.chapter.content, '<p>Content!</p>')
  test.equals(result.chapter.name, 'Chapter 1')
})

tap.test('get-chapter-state - returns null', async function (test) {
  const request = httpMocks.createRequest({
    method: 'GET',
    url: '/reader/0/0',
    session: { id: 'thing' },
    query: { first: true },
    params: {
      bookId: 0
    }
  })
  returnChapter = Promise.resolve(null)
  request.user = { token: 'thing' }
  const response = httpMocks.createResponse()
  const result = await getChapterState(request, response)
  test.notOk(result)
  test.equals(result, null)
})
