/* global it, describe, before, beforeEach, afterEach */
import { expect } from '@open-wc/testing'
import { createAPI } from '../components/api.state.js'

describe('api.state', () => {
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

  it('api.profile - gets the profile', async () => {
    window.api = createAPI({ csrfToken: 'csrfToken' })
    const profile = {
      id: '/reader-user-id',
      outbox: '/reader-user-id/outbox',
      streams: {
        items: [{ id: '/reader-id/library' }]
      }
    }
    window.fetchMock.get('/whoami', profile)

    const outbox = await window.api.profile.outbox()
    const upload = await window.api.profile.upload()
    expect(outbox).to.equal('/reader-user-id/outbox')
    expect(upload).to.equal('/reader-user-id/file-upload')
  })

  it('api.profile - creates the profile when necessary', async () => {
    window.api = createAPI({ csrfToken: 'csrfToken' })
    const profile = {
      id: '/reader-user-id',
      outbox: '/reader-id/outbox',
      streams: {
        items: [{ id: '/reader-id/library' }]
      }
    }
    window.fetchMock.get('/whoami', 404)

    window.fetchMock.post('/readers', {
      status: 200,
      headers: { location: '/reader-id' }
    })
    window.fetchMock.get('/reader-id', profile)
    const outbox = await window.api.profile.outbox()
    expect(outbox).to.equal('/reader-id/outbox')
  })

  it('api.activity.create - creates', async () => {
    const fakeDoc = {
      type: 'Create',
      object: { type: 'Document', content: 'Loads!' }
    }
    const profile = { id: '/reader-user-id', outbox: '/api/outbox' }

    window.fetchMock.post('/api/outbox', {
      status: 200,
      headers: { location: '/api/activity-id' }
    })
    window.fetchMock.get('/whoami', profile)
    const location = await window.api.activity.create(fakeDoc)
    expect(location).to.equal('/api/activity-id')
  })

  it('api.activity.createAndGetID - creates and gets id', async () => {
    const fakeDoc = {
      type: 'Create',
      object: { type: 'Document', content: 'Loads!' }
    }
    const fakeResult = { object: { type: 'FakeDoc', id: '/doc-id' } }
    const profile = { id: '/reader-user-id', outbox: '/api/outbox' }

    window.fetchMock.post('/api/outbox', {
      status: 200,
      headers: { location: '/api/activity-id' }
    })
    window.fetchMock.get('/whoami', profile)
    window.fetchMock.get('/api/activity-id', fakeResult)
    const result = await window.api.activity.createAndGetID(fakeDoc)
    expect(result).to.equal('/doc-id')
  })

  it('api.activity.create - creates from unwrapped activities', async () => {
    const fakeDoc = { type: 'Document', content: 'Loads!' }
    const profile = { id: '/reader-user-id', outbox: '/api/outbox' }

    window.fetchMock.post('/api/outbox', {
      status: 200,
      headers: { location: '/api/activity-id' }
    })
    window.fetchMock.get('/whoami', profile)
    const location = await window.api.activity.create(fakeDoc)
    expect(location).to.equal('/api/activity-id')
  })

  it('api.activity.create - errors when the outbox errors', async () => {
    const fakeDoc = { type: 'Document', content: 'Loads!' }
    const profile = { id: '/reader-user-id', outbox: '/api/outbox' }

    window.fetchMock.post('/api/outbox', 500)
    window.fetchMock.get('/whoami', profile)
    let httpMethod
    try {
      await window.api.activity.create(fakeDoc)
    } catch (err) {
      httpMethod = err.httpMethod
    }
    expect(httpMethod).to.equal('POST/Outbox')
  })

  it('api.activity.add - adds', async () => {
    const fakeDoc = {
      type: 'Add',
      object: { type: 'reader:Stack', id: '/stack-id' },
      target: { type: 'Document', id: '/doc-id' }
    }
    const profile = { id: '/reader-user-id', outbox: '/api/outbox' }

    window.fetchMock.post('/api/outbox', {
      status: 200,
      headers: { location: '/api/activity-id-for-stack' }
    })
    window.fetchMock.get('/whoami', profile)
    const location = await window.api.activity.add(fakeDoc)
    expect(location).to.equal('/api/activity-id-for-stack')
  })

  it('api.activity.remove - removes', async () => {
    const fakeDoc = {
      type: 'Remove',
      object: { type: 'reader:Stack', id: '/stack-id' },
      target: { type: 'Document', id: '/doc-id' }
    }
    const profile = { id: '/reader-user-id', outbox: '/api/outbox' }

    window.fetchMock.post('/api/outbox', {
      status: 200,
      headers: { location: '/api/activity-id-for-stack-remove' }
    })
    window.fetchMock.get('/whoami', profile)
    const location = await window.api.activity.remove(fakeDoc)
    expect(location).to.equal('/api/activity-id-for-stack-remove')
  })

  it('api.activity.update - updates', async () => {
    const fakeDoc = {
      type: 'Update',
      object: { type: 'Document', content: 'Loads!', id: '/doc-id' }
    }
    const profile = { id: '/reader-user-id', outbox: '/api/outbox' }

    window.fetchMock.post('/api/outbox', {
      status: 200,
      headers: { location: '/api/activity-id-for-update' }
    })
    window.fetchMock.get('/whoami', profile)
    const location = await window.api.activity.update(fakeDoc)
    expect(location).to.equal('/api/activity-id-for-update')
  })

  it('api.activity.delete - deletes', async () => {
    const fakeDoc = {
      type: 'Delete',
      object: { type: 'Document', content: 'Loads!', id: '/doc-id' }
    }
    const profile = { id: '/reader-user-id', outbox: '/api/outbox' }

    window.fetchMock.post('/api/outbox', {
      status: 200,
      headers: { location: '/api/activity-id-for-delete' }
    })
    window.fetchMock.get('/whoami', profile)
    const location = await window.api.activity.delete(fakeDoc)
    expect(location).to.equal('/api/activity-id-for-delete')
  })

  it('api.activity.upload - errors when upload errors', async () => {
    const testFile = new window.File(['text file'], 'test.txt', {
      type: 'text/plain'
    })
    const profile = { id: '/reader-user-id' }

    window.fetchMock.post('/reader-user-id/file-upload', 500)
    window.fetchMock.get('/whoami', profile)
    let httpMethod
    try {
      await window.api.activity.upload(testFile)
    } catch (err) {
      httpMethod = err.httpMethod
    }
    expect(httpMethod).to.equal('POST/Upload Media')
  })

  it('api.activity.upload - uploads', async () => {
    const testFile = new window.File(['text file'], 'test.txt', {
      type: 'text/plain'
    })
    const fakeResponse = { url: 'https://example.com/fake-url' }
    const profile = { id: '/reader-user-id' }

    window.fetchMock.post('/reader-user-id/file-upload', fakeResponse)
    window.fetchMock.get('/whoami', profile)
    const response = await window.api.activity.upload(testFile)
    expect(response).to.include(fakeResponse)
  })

  it('api.logout - logs out', async () => {
    let called
    const handler = {
      get: function (obj, prop) {
        if (prop === 'location') {
          return {
            reload () {
              called = true
            }
          }
        } else {
          return obj[prop]
        }
      }
    }
    const fakeGlobal = new Proxy(window, handler)
    window.api = createAPI({ csrfToken: 'csrfToken' }, fakeGlobal)
    const profile = { id: '/reader-user-id' }

    window.fetchMock.post('/logout', 200)
    window.fetchMock.get('/whoami', profile)
    await window.api.logout()
    expect(called).to.equal(true)
  })

  it('api.book.chapter - gets the chapter', async () => {
    const fakeDoc = { id: 'fake-chapter', type: 'Document' }
    const profile = {
      id: '/reader-user-id',
      outbox: '/reader-user-id/outbox',
      streams: {
        items: [{ id: '/reader-id/library' }]
      }
    }
    window.fetchMock.get('/whoami', profile)

    window.fetchMock.get('/reader-id/book-id/chapter1', fakeDoc)
    const response = await window.api.book.chapter(
      '/reader-id/book-id/chapter1'
    )
    expect(response).to.include(fakeDoc)
  })

  it('api.book.get - gets the book', async () => {
    const fakeDoc = { id: 'fake-chapter', type: 'Document' }
    const profile = {
      id: '/reader-user-id',
      outbox: '/reader-user-id/outbox',
      streams: {
        items: [{ id: '/reader-id/library' }]
      }
    }
    window.fetchMock.get('/whoami', profile)

    window.fetchMock.get('/book-id', fakeDoc)
    const response = await window.api.book.get('book-id')
    expect(response).to.include(fakeDoc)
  })

  afterEach(() => {
    window.api = undefined
    window.fetchMock.reset()
  })
})
