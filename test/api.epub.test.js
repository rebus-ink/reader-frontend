/* global it, describe, before, beforeEach, afterEach */
import { expect } from '@open-wc/testing'
import { createAPI } from '../components/api.state.js'
import { parseOPF } from '../components/formats/epub/parseOPF.js'
import * as files from './test-files/epub-test-files.js'
import '../js/vendor/zip.js'

window.ZIPJSPATH = '../../js/vendor/zip.js'
window.PDFJSPATH = '../../js/pdfjs-dist/build/pdf.min.js'

describe('api.formats.epub', () => {
  before(() => {
    if (!window.fetchMock) {
      const script = document.createElement('script')
      script.async = false
      script.src = '/node_modules/fetch-mock/dist/es5/client-bundle.js'
      document.head.appendChild(script)
    }
  })
  beforeEach(() => {
    window.api = createAPI({ csrfToken: 'csrfToken' })
  })
  afterEach(() => {
    window.api = undefined
    window.fetchMock.reset()
  })
  it('processes epub files properly', async () => {
    window.fetchMock.post('express:/publication-:id/file-upload', 200)
    window.fetchMock.post('/api/outbox', {
      status: 200,
      headers: { location: '/api/activity-id' }
    })
    const profile = { id: '/reader-user-id', outbox: '/api/outbox' }
    window.fetchMock.get('/whoami', profile)
    const fakeResult = { object: { type: 'FakeDoc', id: '/publication-id' } }
    window.fetchMock.get('/api/activity-id', fakeResult)
    const epub = await window.api.formats.epub(window.atob(files.testEpub))
    expect(epub).to.deep.include({
      type: 'Publication',
      author: ['Baldur Bjarnason'],
      id: '/publication-id',
      inLanguage: 'en',
      name: 'Minimal Test File',
      identifier: 'urn:D35116F7-9AF8-4C13-B348-85E031B31080',
      resources: [
        {
          url: 'OEBPS/toc.ncx',
          rel: ['ncx'],
          encodingFormat: 'application/x-dtbncx+xml'
        },
        { url: 'OEBPS/css/style.css', rel: [], encodingFormat: 'text/css' },
        {
          url: 'OEBPS/aftermath.xhtml',
          rel: [],
          encodingFormat: 'application/xhtml+xml'
        },
        {
          type: 'LinkedResource',
          rel: ['alternate'],
          url: 'original.epub',
          encodingFormat: 'application/epub+zip'
        },
        {
          type: 'LinkedResource',
          rel: ['alternate'],
          url: 'original.opf',
          encodingFormat: 'application/oebps-package+xml'
        }
      ],
      readingOrder: [
        {
          url: 'OEBPS/aftermath.xhtml',
          rel: [],
          encodingFormat: 'application/xhtml+xml'
        }
      ]
    })
  })
  it('processes opf files with html navs properly', async () => {
    const epub = parseOPF(
      files.propertiesNav,
      'OEBPS/content.opf',
      window.api,
      window
    )
    expect(epub).to.deep.include({
      type: 'Publication',
      links: [],
      resources: [
        {
          url: 'OEBPS/toc.ncx',
          rel: ['ncx'],
          encodingFormat: 'application/x-dtbncx+xml'
        },
        {
          url: 'OEBPS/css/style.css',
          rel: [],
          encodingFormat: 'text/css'
        },
        {
          url: 'OEBPS/aftermath.xhtml',
          rel: [],
          encodingFormat: 'application/xhtml+xml'
        },
        {
          url: 'OEBPS/nav.xhtml',
          rel: ['contents'],
          encodingFormat: 'application/xhtml+xml'
        },
        {
          url: 'OEBPS/placeholder-cover.png',
          rel: ['cover'],
          encodingFormat: 'image/png'
        }
      ],
      readingOrder: [
        {
          url: 'OEBPS/aftermath.xhtml',
          rel: [],
          encodingFormat: 'application/xhtml+xml'
        }
      ],
      json: {
        epubVersion: '3.0'
      },
      inLanguage: 'en',
      name: 'Minimal Test File',
      identifier: 'urn:D35116F7-9AF8-4C13-B348-85E031B31080',
      author: ['Baldur Bjarnason']
    })
  })
  it('processes opf files with meta covers properly', async () => {
    const epub = parseOPF(
      files.metaCover,
      'OEBPS/content.opf',
      window.api,
      window
    )
    expect(epub).to.deep.include({
      type: 'Publication',
      links: [],
      resources: [
        {
          url: 'OEBPS/toc.ncx',
          rel: ['ncx'],
          encodingFormat: 'application/x-dtbncx+xml'
        },
        {
          url: 'OEBPS/css/style.css',
          rel: [],
          encodingFormat: 'text/css'
        },
        {
          url: 'OEBPS/aftermath.xhtml',
          rel: [],
          encodingFormat: 'application/xhtml+xml'
        },
        {
          url: 'OEBPS/placeholder-cover.png',
          rel: ['cover'],
          encodingFormat: 'image/png'
        }
      ],
      readingOrder: [
        {
          url: 'OEBPS/aftermath.xhtml',
          rel: [],
          encodingFormat: 'application/xhtml+xml'
        }
      ],
      json: {
        epubVersion: '3.0'
      },
      inLanguage: 'en',
      name: 'Minimal Test File',
      identifier: 'urn:D35116F7-9AF8-4C13-B348-85E031B31080',
      author: ['Baldur Bjarnason']
    })
  })
})
