/* global it, describe, before, beforeEach, afterEach */
import { expect, oneEvent } from '@open-wc/testing'
import { createAPI } from '../components/api.state.js'
// import '/js/pdfjs-dist/build/pdf.min.js'
// console.log(window.pdfjsLib)
// window.pdfjsLib.GlobalWorkerOptions.workerSrc =
//   '/js/pdfjs-dist/build/pdf.worker.js'
// window.CMAP_URL = '/js/pdfjs-dist/cmaps/'
// window.CMAP_PACKED = true

// window.ZIPJSPATH = '../../js/vendor/zip.js'
// window.PDFJSPATH = '../../js/pdfjs-dist/build/pdf.min.js'
// Expires in five year's time.
const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmYWtlLXVzZXItaWQiLCJpYXQiOjE1NTg3MzA1NjMsImV4cCI6MTcxNjUxODU2MywiYXVkIjoiYXdkaWVuc2giLCJpc3MiOiJpc2h1ZXIiLCJqdGkiOiJmYWtlLWp3dC1pZCJ9.S3GRr9rkrrX9kkXlox-7TTKsKT7dZ8lhgnlHJc6RYLI'

const testfileURLs = [
  '/test/test-files/this-is-a-test-pdf.pdf',
  '/test/test-files/this-is-a-test-pdf-optimized.pdf',
  '/test/test-files/this-is-a-test-pdf-flattened.pdf'
]
const testFiles = []
async function getFiles () {
  window.fetchMock.restore()
  const response1 = await window.fetch(testfileURLs[0])
  const blob1 = await response1.blob()
  testFiles[0] = new window.File([blob1], 'this-is-a-test-pdf.pdf', {
    type: 'application/pdf'
  })
  const response2 = await window.fetch(testfileURLs[0])
  const blob2 = await response2.blob()
  testFiles[1] = new window.File([blob2], 'this-is-a-test-pdf-optimized.pdf', {
    type: 'application/pdf'
  })
  const response3 = await window.fetch(testfileURLs[0])
  const blob3 = await response3.blob()
  testFiles[2] = new window.File([blob3], 'this-is-a-test-pdf-flattened.pdf', {
    type: 'application/pdf'
  })
}

describe('api.formats.pdf', () => {
  before(async () => {
    await getFiles()
    if (!window.fetchMock) {
      const script = document.createElement('script')
      script.async = false
      script.src = '/node_modules/fetch-mock/dist/es5/client-bundle.js'
      document.head.appendChild(script)
    }
    const pdfScript = document.createElement('script')
    pdfScript.async = false
    pdfScript.src = '/js/pdfjs-dist/build/pdf.min.js'
    document.head.appendChild(pdfScript)
    await oneEvent(pdfScript, 'load')
    window.pdfjsLib.GlobalWorkerOptions.workerSrc =
      '/js/pdfjs-dist/build/pdf.worker.js'
    window.CMAP_URL = '/js/pdfjs-dist/cmaps/'
    window.CMAP_PACKED = true
  })
  beforeEach(() => {
    window.api = createAPI({ csrfToken: 'csrfToken' })
  })
  afterEach(() => {
    window.api = undefined
    window.fetchMock.reset()
  })
  it('processes regular pdf files properly', async () => {
    window.fetchMock.post('/refresh-token', () => {
      return { token }
    })
    const uploadedFileSize = []
    window.fetchMock.post(
      'express:/publication-:id/file-upload',
      (url, opts) => {
        const { body } = opts
        const file = body.get('file')
        uploadedFileSize.push(file.size)
        return 200
      }
    )
    window.fetchMock.post('/api/outbox', {
      status: 200,
      headers: { location: '/api/activity-id' }
    })
    const profile = { id: '/reader-user-id', outbox: '/api/outbox' }
    window.fetchMock.get('/whoami', profile)
    const fakeResult = { object: { type: 'FakeDoc', id: '/publication-id' } }
    window.fetchMock.get('/api/activity-id', fakeResult)
    const file = new window.File([testFiles[0]], 'test.pdf', {
      type: 'application/pdf'
    })
    const pdf = await window.api.formats.pdf(file)
    expect(uploadedFileSize[0]).to.equal(30023)
    expect(uploadedFileSize[1]).to.be.above(100000)
    expect(pdf).to.deep.include({
      type: 'Publication',
      links: [],
      json: {
        pdfInfo: {
          PDFFormatVersion: '1.3',
          IsLinearized: false,
          IsAcroFormPresent: false,
          IsXFAPresent: false,
          Title: 'This Is A Test PDF',
          Author: 'Test Author',
          Subject: 'Test Subject',
          Keywords: 'Test Keywords, Many Of Them',
          Creator: 'Byword',
          Producer: 'Mac OS X 10.13.6 Quartz PDFContext',
          CreationDate: "D:20190530192548Z00'00'",
          ModDate: "D:20190530152747-04'00'"
        },
        pdfMetadata: {},
        totalPages: 8
      },
      name: 'This Is A Test PDF',
      author: ['Test Author'],
      resources: [
        {
          type: 'LinkedResource',
          rel: ['alternate'],
          url: 'test.pdf',
          encodingFormat: 'application/pdf'
        },
        {
          type: 'LinkedResource',
          rel: ['cover'],
          url: 'cover.jpeg',
          encodingFormat: 'image/jpeg'
        }
      ],
      readingOrder: [
        {
          type: 'LinkedResource',
          url: 'test.pdf',
          encodingFormat: 'application/pdf'
        }
      ],
      id: '/publication-id'
    })
  })
  it('processes optimized pdf files properly', async () => {
    window.fetchMock.post('/refresh-token', () => {
      return { token }
    })
    window.fetchMock.post('express:/publication-:id/file-upload', 200)
    window.fetchMock.post('/api/outbox', {
      status: 200,
      headers: { location: '/api/activity-id' }
    })
    const profile = { id: '/reader-user-id', outbox: '/api/outbox' }
    window.fetchMock.get('/whoami', profile)
    const fakeResult = { object: { type: 'FakeDoc', id: '/publication-id' } }
    window.fetchMock.get('/api/activity-id', fakeResult)
    const file = new window.File([testFiles[1]], 'test.pdf', {
      type: 'application/pdf'
    })
    const pdf = await window.api.formats.pdf(file)
    expect(pdf).to.deep.include({
      type: 'Publication',
      links: [],
      json: {
        pdfInfo: {
          PDFFormatVersion: '1.3',
          IsLinearized: false,
          IsAcroFormPresent: false,
          IsXFAPresent: false,
          Title: 'This Is A Test PDF',
          Author: 'Test Author',
          Subject: 'Test Subject',
          Keywords: 'Test Keywords, Many Of Them',
          Creator: 'Byword',
          Producer: 'Mac OS X 10.13.6 Quartz PDFContext',
          CreationDate: "D:20190530192548Z00'00'",
          ModDate: "D:20190530152747-04'00'"
        },
        pdfMetadata: {},
        totalPages: 8
      },
      name: 'This Is A Test PDF',
      author: ['Test Author'],
      resources: [
        {
          type: 'LinkedResource',
          rel: ['alternate'],
          url: 'test.pdf',
          encodingFormat: 'application/pdf'
        },
        {
          type: 'LinkedResource',
          rel: ['cover'],
          url: 'cover.jpeg',
          encodingFormat: 'image/jpeg'
        }
      ],
      readingOrder: [
        {
          type: 'LinkedResource',
          url: 'test.pdf',
          encodingFormat: 'application/pdf'
        }
      ],
      id: '/publication-id'
    })
  })
  it('processes flattened pdf files properly', async () => {
    window.fetchMock.post('/refresh-token', () => {
      return { token }
    })
    window.fetchMock.post('express:/publication-:id/file-upload', 200)
    window.fetchMock.post('/api/outbox', {
      status: 200,
      headers: { location: '/api/activity-id' }
    })
    const profile = { id: '/reader-user-id', outbox: '/api/outbox' }
    window.fetchMock.get('/whoami', profile)
    const fakeResult = { object: { type: 'FakeDoc', id: '/publication-id' } }
    window.fetchMock.get('/api/activity-id', fakeResult)
    const file = new window.File([testFiles[2]], 'test.pdf', {
      type: 'application/pdf'
    })
    const pdf = await window.api.formats.pdf(file)
    expect(pdf).to.deep.include({
      type: 'Publication',
      links: [],
      json: {
        pdfInfo: {
          PDFFormatVersion: '1.3',
          IsLinearized: false,
          IsAcroFormPresent: false,
          IsXFAPresent: false,
          Title: 'This Is A Test PDF',
          Author: 'Test Author',
          Subject: 'Test Subject',
          Keywords: 'Test Keywords, Many Of Them',
          Creator: 'Byword',
          Producer: 'Mac OS X 10.13.6 Quartz PDFContext',
          CreationDate: "D:20190530192548Z00'00'",
          ModDate: "D:20190530152747-04'00'"
        },
        pdfMetadata: {},
        totalPages: 8
      },
      name: 'This Is A Test PDF',
      author: ['Test Author'],
      resources: [
        {
          type: 'LinkedResource',
          rel: ['alternate'],
          url: 'test.pdf',
          encodingFormat: 'application/pdf'
        },
        {
          type: 'LinkedResource',
          rel: ['cover'],
          url: 'cover.jpeg',
          encodingFormat: 'image/jpeg'
        }
      ],
      readingOrder: [
        {
          type: 'LinkedResource',
          url: 'test.pdf',
          encodingFormat: 'application/pdf'
        }
      ],
      id: '/publication-id'
    })
  })
})
