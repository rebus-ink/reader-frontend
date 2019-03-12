const path = require('path')
const jwt = require('jsonwebtoken')
const cappadonna = require('./utils/cappadonna-modules-fork.js')
const test = cappadonna(
  path.join(__dirname, './test-files/activities-with-mocks.js'),
  {
    require: { expose: 'mockedActivities' },
    istanbul: { ignore: ['**/node_modules/**', '**/tests/**'] }
  }
)

function generateToken (expiresIn = '30m') {
  return jwt.sign({ sub: 'fake-user-id' }, 'secrit!', {
    algorithm: 'HS256',
    expiresIn,
    jwtid: 'fake-jwt-id',
    audience: 'awdiensh',
    issuer: 'ishuer'
  })
}
function generateExpiredToken () {
  const exp = Math.floor(Date.now() / 1000 - 600)
  return jwt.sign({ sub: 'fake-user-id', exp }, 'secrit!', {
    algorithm: 'HS256',
    jwtid: 'fake-jwt-id',
    audience: 'awdiensh',
    issuer: 'ishuer'
  })
}

test('get - error refreshing token', async (page, t) => {
  await page.evaluate(async () => {
    const meta = window.document.createElement('meta')
    meta.setAttribute('name', 'csrf-token')
    meta.setAttribute('content', 'test')
    window.document.head.appendChild(meta)
    const { activities, fetchMock } = require('mockedActivities')
    const fakeDoc = { id: 'fake-document', type: 'Document' }
    const profile = { id: '/reader-user-id' }
    fetchMock.post('/refresh-token', 500)
    fetchMock.get('express:/api/:document', fakeDoc)
    fetchMock.get('/whoami', profile)
    try {
      await activities.get('/api/document-with-an-id')
    } catch (err) {
      t.equals(err.message, 'JWT Refresh Error:')
    }
    t.notOk(fetchMock.called('express:/api/:document'))
  })
  t.end()
})

test('get - no token', async (page, t) => {
  await page.evaluate(async token => {
    const meta = window.document.createElement('meta')
    meta.setAttribute('name', 'csrf-token')
    meta.setAttribute('content', 'test')
    window.document.head.appendChild(meta)
    const { activities, fetchMock } = require('mockedActivities')
    const fakeDoc = { id: 'fake-document', type: 'Document' }
    const profile = { id: '/reader-user-id' }
    fetchMock.post('/refresh-token', () => {
      return { token }
    })
    fetchMock.get('express:/api/:document', fakeDoc)
    fetchMock.get('/whoami', profile)
    const document = await activities.get('/api/document-with-an-id')
    t.match(document, fakeDoc)
    t.ok(fetchMock.called('/refresh-token'))
    t.ok(fetchMock.called('express:/api/:document'))
    const lastCall = fetchMock.lastCall('express:/api/:document')[1]
    const auth = lastCall.headers.get('Authorization')
    t.equals(auth, `Bearer ${token}`)
    const type = lastCall.headers.get('content-type')
    t.equals(type, 'application/ld+json')
  }, generateToken())
  t.end()
})

test('get - embedded expired token', async (page, t) => {
  await page.evaluate(async token => {
    const meta = window.document.createElement('meta')
    meta.setAttribute('name', 'jwt-meta')
    meta.setAttribute('content', token)
    window.document.head.appendChild(meta)
    const { activities, fetchMock } = require('mockedActivities')
    const fakeDoc = { id: 'fake-document', type: 'Document' }
    const profile = { id: '/reader-user-id' }
    fetchMock.post('/refresh-token', () => {
      return { token: 'should-be-called' }
    })
    fetchMock.get('express:/api/:document', fakeDoc)
    fetchMock.get('/whoami', profile)
    const document = await activities.get('/api/document-with-an-id')
    t.match(document, fakeDoc)
    // t.notOk(fetchMock.called('/refresh-token'))
    const authHeader = fetchMock
      .lastCall('express:/api/:document')[1]
      .headers.get('Authorization')
    const usedToken = authHeader.split(' ')[1]
    t.equals(usedToken, 'should-be-called')
    t.ok(fetchMock.called('express:/api/:document'))
  }, generateExpiredToken())
  t.end()
})

test('create', async (page, t) => {
  await page.evaluate(async token => {
    const { activities, fetchMock } = require('mockedActivities')
    const fakeDoc = {
      type: 'Create',
      object: { type: 'Document', content: 'Loads!' }
    }
    const profile = { id: '/reader-user-id', outbox: '/api/outbox' }
    fetchMock.post('/refresh-token', () => {
      return { token }
    })
    fetchMock.post('/api/outbox', {
      status: 200,
      headers: { location: '/api/activity-id' }
    })
    fetchMock.get('/whoami', profile)
    const location = await activities.create(fakeDoc)
    t.equals(location, '/api/activity-id')
    const authHeader = fetchMock
      .lastCall('express:/api/:document')[1]
      .headers.get('Authorization')
    const usedToken = authHeader.split(' ')[1]
    t.equals(usedToken, token)
    t.ok(fetchMock.called('express:/api/:document'))
  }, generateToken())
  t.end()
})

test('create - unwrapped', async (page, t) => {
  await page.evaluate(async token => {
    const { activities, fetchMock } = require('mockedActivities')
    const fakeDoc = { type: 'Document', content: 'Loads!' }
    const profile = { id: '/reader-user-id', outbox: '/api/outbox' }
    fetchMock.post('/refresh-token', () => {
      return { token }
    })
    fetchMock.post('/api/outbox', {
      status: 200,
      headers: { location: '/api/activity-id' }
    })
    fetchMock.get('/whoami', profile)
    const location = await activities.create(fakeDoc)
    t.equals(location, '/api/activity-id')
    const authHeader = fetchMock
      .lastCall('express:/api/:document')[1]
      .headers.get('Authorization')
    const usedToken = authHeader.split(' ')[1]
    t.equals(usedToken, token)
    t.ok(fetchMock.called('express:/api/:document'))
  }, generateToken())
  t.end()
})

test('create - error', async (page, t) => {
  await page.evaluate(async token => {
    const { activities, fetchMock } = require('mockedActivities')
    const fakeDoc = {
      type: 'Create',
      object: { type: 'Document', content: 'Loads!' }
    }
    const profile = { id: '/reader-user-id', outbox: '/api/outbox' }
    fetchMock.post('/refresh-token', () => {
      return { token }
    })
    fetchMock.post('/api/outbox', 500)
    fetchMock.get('/whoami', profile)
    try {
      await activities.create(fakeDoc)
    } catch (err) {
      t.equals(err.message, 'POST Error:')
    }
  }, generateToken())
  t.end()
})

test('upload - error', async (page, t) => {
  await page.evaluate(async token => {
    const meta = window.document.createElement('link')
    meta.setAttribute('rel', 'rebus-upload')
    meta.setAttribute('href', '/reader-user-id/file-upload')
    window.document.head.appendChild(meta)
    const { activities, fetchMock } = require('mockedActivities')
    const testFile = new window.File(['text file'], 'test.txt', {
      type: 'text/plain'
    })
    const profile = { id: '/reader-user-id' }
    fetchMock.post('/refresh-token', () => {
      return { token }
    })
    fetchMock.post('/reader-user-id/file-upload', 500)
    fetchMock.get('/whoami', profile)
    try {
      await activities.upload(testFile)
    } catch (err) {
      t.equals(err.message, 'POST Error:')
    }
  }, generateToken())
  t.end()
})

test('upload', async (page, t) => {
  await page.evaluate(async token => {
    const meta = window.document.createElement('link')
    meta.setAttribute('rel', 'rebus-upload')
    meta.setAttribute('href', '/reader-user-id/file-upload')
    window.document.head.appendChild(meta)
    const { activities, fetchMock } = require('mockedActivities')
    const testFile = new window.File(['text file'], 'test.txt', {
      type: 'text/plain'
    })
    const fakeResponse = { url: 'https://example.com/fake-url' }
    const profile = { id: '/reader-user-id' }
    fetchMock.post('/refresh-token', () => {
      return { token }
    })
    fetchMock.post('/reader-user-id/file-upload', fakeResponse)
    fetchMock.get('/whoami', profile)
    const response = await activities.upload(testFile)
    t.match(fakeResponse, response)
  }, generateToken())
  t.end()
})
