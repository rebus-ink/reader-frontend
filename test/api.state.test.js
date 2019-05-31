/* global it, describe, before, beforeEach, afterEach */
import { expect } from '@open-wc/testing'
import { createAPI } from '../components/api.state.js'

// Expires in five year's time.
const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmYWtlLXVzZXItaWQiLCJpYXQiOjE1NTg3MzA1NjMsImV4cCI6MTcxNjUxODU2MywiYXVkIjoiYXdkaWVuc2giLCJpc3MiOiJpc2h1ZXIiLCJqdGkiOiJmYWtlLWp3dC1pZCJ9.S3GRr9rkrrX9kkXlox-7TTKsKT7dZ8lhgnlHJc6RYLI'

// Already expired, natch.
const expired =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmYWtlLXVzZXItaWQiLCJleHAiOjE1NTg3MzAwMTgsImlhdCI6MTU1ODczMDYxOCwiYXVkIjoiYXdkaWVuc2giLCJpc3MiOiJpc2h1ZXIiLCJqdGkiOiJmYWtlLWp3dC1pZCJ9.D-ppzIjgfpODrRj_rz5DWy-2c5YzkFt0EhnundInCyI'

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

  it('api.state.jwt - errors when token refresh errors', async () => {
    const fakeDoc = { id: 'fake-document', type: 'Collection' }
    const profile = { id: '/reader-user-id' }
    window.fetchMock.post('/refresh-token', 500)
    window.fetchMock.get('express:/reader-:id/library', fakeDoc)
    window.fetchMock.get('/whoami', profile)
    try {
      await window.api.library()
    } catch (err) {
      expect(err.httpMethod).to.equal('POST/JWT Refresh')
    }
    expect(window.fetchMock.called('express:/reader-:id/library')).to.equal(
      false
    )
  })

  it('api.state.jwt - correctly refreshes token when no one exists', async () => {
    window.api = createAPI({ csrfToken: 'csrfToken', token: expired })
    const fakeDoc = { id: 'fake-document', type: 'Collection' }
    const profile = {
      id: '/reader-user-id',
      streams: {
        items: [{ id: '/reader-id/library' }]
      }
    }
    window.fetchMock.post('/refresh-token', () => {
      return { token }
    })
    window.fetchMock.get('/reader-id/library', fakeDoc)
    window.fetchMock.get('/whoami', profile)
    const document = await window.api.library()
    expect(document).to.include(fakeDoc)
    expect(window.fetchMock.called('/refresh-token')).to.equal(true)
    expect(window.fetchMock.called('/reader-id/library')).to.equal(true)
    const lastCall = window.fetchMock.lastCall('/reader-id/library')[1]
    const auth = lastCall.headers.get('Authorization')
    expect(auth).to.equal(`Bearer ${token}`)
    const type = lastCall.headers.get('content-type')
    expect(type).to.equal('application/ld+json')
  })

  it('api.state.jwt - does not refresh token when exists', async () => {
    window.api = createAPI({ csrfToken: 'csrfToken', token })
    const fakeDoc = { id: 'fake-document', type: 'Collection' }
    const profile = {
      id: '/reader-user-id',
      streams: {
        items: [{ id: '/reader-id/library' }]
      }
    }
    window.fetchMock.get('/reader-id/library', fakeDoc)
    window.fetchMock.get('/whoami', profile)
    window.fetchMock.post('/refresh-token', () => {
      return { token }
    })
    const document = await window.api.library()
    expect(document).to.include(fakeDoc)
    expect(window.fetchMock.called('/refresh-token')).to.equal(false)
    expect(window.fetchMock.called('/reader-id/library')).to.equal(true)
    const lastCall = window.fetchMock.lastCall('/reader-id/library')[1]
    const auth = lastCall.headers.get('Authorization')
    expect(auth).to.equal(`Bearer ${token}`)
    const type = lastCall.headers.get('content-type')
    expect(type).to.equal('application/ld+json')
  })

  it('api.profile - gets the profile', async () => {
    window.api = createAPI({ csrfToken: 'csrfToken', token })
    const profile = {
      id: '/reader-user-id',
      outbox: '/reader-user-id/outbox',
      streams: {
        items: [{ id: '/reader-id/library' }]
      }
    }
    window.fetchMock.get('/whoami', profile)
    window.fetchMock.post('/refresh-token', () => {
      return { token }
    })
    const outbox = await window.api.profile.outbox()
    const upload = await window.api.profile.upload()
    expect(outbox).to.equal('/reader-user-id/outbox')
    expect(upload).to.equal('/reader-user-id/file-upload')
  })

  it('api.profile - creates the profile when necessary', async () => {
    window.api = createAPI({ csrfToken: 'csrfToken', token })
    const profile = {
      id: '/reader-user-id',
      outbox: '/reader-id/outbox',
      streams: {
        items: [{ id: '/reader-id/library' }]
      }
    }
    window.fetchMock.get('/whoami', 404)
    window.fetchMock.post('/refresh-token', () => {
      return { token }
    })
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
    window.fetchMock.post('/refresh-token', () => {
      return { token }
    })
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
    window.fetchMock.post('/refresh-token', () => {
      return { token }
    })
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
    window.fetchMock.post('/refresh-token', () => {
      return { token }
    })
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
    window.fetchMock.post('/refresh-token', () => {
      return { token }
    })
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
    window.fetchMock.post('/refresh-token', () => {
      return { token }
    })
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
    window.fetchMock.post('/refresh-token', () => {
      return { token }
    })
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
    window.fetchMock.post('/refresh-token', () => {
      return { token }
    })
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
    window.fetchMock.post('/refresh-token', () => {
      return { token }
    })
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
    window.fetchMock.post('/refresh-token', () => {
      return { token }
    })
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
    window.fetchMock.post('/refresh-token', () => {
      return { token }
    })
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
    window.fetchMock.post('/refresh-token', () => {
      return { token }
    })
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
    window.fetchMock.post('/refresh-token', () => {
      return { token }
    })
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
    window.fetchMock.post('/refresh-token', () => {
      return { token }
    })
    window.fetchMock.get('/book-id', fakeDoc)
    const response = await window.api.book.get('book-id')
    expect(response).to.include(fakeDoc)
  })

  afterEach(() => {
    window.api = undefined
    window.fetchMock.reset()
  })
})
