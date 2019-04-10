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
      name: 'Chapter 1',
      'reader:path': 'document1.html'
    },
    {
      type: 'Document',
      id: `https://example.com/publication/0/document/2`,
      name: 'Chapter 2',
      'reader:path': 'document2.html'
    },
    {
      type: 'Document',
      id: `https://example.com/publication/0/document/3`,
      name: 'Chapter 3',
      'reader:path': 'document3.html'
    },
    {
      type: 'Document',
      id: `https://example.com/publication/0/document/4`,
      name: 'Chapter 4',
      'reader:path': 'document4.html'
    }
  ],
  attachment: [
    {
      type: 'Document',
      id: `https://example.com/publication/0/document/1`,
      name: 'Chapter 1',
      'reader:path': 'document1.html'
    },
    {
      type: 'Document',
      id: `https://example.com/publication/0/document/2`,
      name: 'Chapter 2',
      'reader:path': 'document2.html'
    },
    {
      type: 'Document',
      id: `https://example.com/publication/0/document/3`,
      name: 'Chapter 3',
      'reader:path': 'document3.html'
    },
    {
      type: 'Document',
      id: `https://example.com/publication/0/document/4`,
      name: 'Chapter 4',
      'reader:path': 'document4.html'
    }
  ]
}
const fakeGot = () => returnData
const stubs = {
  './api-get.js': { get: fakeGot }
}
const { getBookState } = proxyquire('../server/utils/get-book-state.js', stubs)
const httpMocks = require('node-mocks-http')

tap.test('get-book-state', async function (test) {
  const request = httpMocks.createRequest({
    method: 'GET',
    url: '/reader/0',
    session: { id: 'thing' },
    query: { first: true },
    params: {
      bookId: 0
    }
  })
  request.user = { token: 'thing' }
  const response = httpMocks.createResponse()
  const { book } = await getBookState(request, response)
  test.equals(book.orderedItems.length, 4)
})

tap.test('get-book-state - returns null', async function (test) {
  const request = httpMocks.createRequest({
    method: 'GET',
    url: '/reader/0',
    session: { id: 'thing' },
    query: { first: true },
    params: {
      bookId: 0
    }
  })
  returnData = Promise.resolve(null)
  request.user = { token: 'thing' }
  const response = httpMocks.createResponse()
  const result = await getBookState(request, response)
  test.notOk(result)
  test.equals(result, null)
})
