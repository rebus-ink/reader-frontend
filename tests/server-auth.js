const tap = require('tap')
const sinon = require('sinon')
const proxyquire = require('proxyquire')
const httpMocks = require('node-mocks-http')
const fakeResult = { id: 'exampleUser' }
const passportAuth = (name, callback) => {
  return (res, req, next) => {
    callback(null, fakeResult)
  }
}
const passportAuthNoUserStored = (name, callback) => {
  return (res, req, next) => {
    callback(null, {
      id: 'exampleUser2',
      provider: 'rebus-test',
      emails: [{ value: 'example@example.com' }]
    })
  }
}
const passportAuthNoUser = (name, callback) => {
  return (res, req, next) => {
    callback(null, undefined)
  }
}
const passportAuthError = (name, callback) => {
  return (res, req, next) => {
    callback(new Error('This broke!'))
  }
}
const stubs = {
  passport: {
    authenticate: passportAuth
  }
}
const exampleUser = {
  id: 'exampleUser',
  email: 'example@example.com',
  readerId: 'BlobbyThoughts!',
  provider: 'fakeprovider'
}
const storage = {
  get: id => {
    if (id === 'exampleUser') {
      return Promise.resolve(exampleUser)
    } else {
      return Promise.resolve()
    }
  },
  set: sinon.fake.returns(true)
}
const { authenticate } = proxyquire('../server/auth/authenticate.js', stubs)

tap.todo('authentication', function (test) {
  const next = sinon.fake.returns(true)
  const request = httpMocks.createRequest({
    method: 'POST',
    url: '/login',
    session: { id: 'thing' },
    query: { first: true },
    params: {}
  })
  const response = httpMocks.createResponse()
  const redirect = sinon.fake.returns(true)
  response.redirect = redirect
  const logIn = (testUser, callback) => {
    test.equals(testUser, exampleUser)
    callback()
    test.ok(redirect.called)
    test.equals(redirect.lastArg, '/')
    test.notOk(next.called)
    test.end()
  }
  request.logIn = logIn
  authenticate({ strategy: { name: 'test' }, storage })(request, response, next)
})

tap.todo('authentication - no user', function (test) {
  stubs.passport.authenticate = passportAuthNoUser
  const next = sinon.fake.returns(true)
  const request = httpMocks.createRequest({
    method: 'POST',
    url: '/login',
    session: { id: 'thing' },
    query: { first: true },
    params: {}
  })
  const response = httpMocks.createResponse()
  const redirect = arg => {
    test.equals(arg, '/login')
    test.notOk(next.called)
    test.end()
  }
  response.redirect = redirect
  authenticate({ strategy: { name: 'test' }, storage })(request, response, next)
})

tap.todo('authentication - no user stored', function (test) {
  stubs.passport.authenticate = passportAuthNoUserStored
  const next = sinon.fake.returns(true)
  const request = httpMocks.createRequest({
    method: 'POST',
    url: '/login',
    session: { id: 'thing' },
    query: { returnTo: '/bingo' },
    params: {}
  })
  const response = httpMocks.createResponse()
  const logIn = (testUser, callback) => {
    callback()
    test.notOk(next.called)
    test.ok(storage.set.called)
    test.matches(testUser, {
      id: 'exampleUser2',
      provider: 'rebus-test',
      email: 'example@example.com'
    })
    test.end()
  }
  request.logIn = logIn
  authenticate({ strategy: { name: 'test' }, storage })(request, response, next)
})

tap.todo('authentication - error', function (test) {
  stubs.passport.authenticate = passportAuthError
  const next = err => {
    test.equals(err.message, 'This broke!')
    test.end()
  }
  const request = httpMocks.createRequest({
    method: 'POST',
    url: '/login',
    session: { id: 'thing' },
    query: { first: true },
    params: {}
  })
  const response = httpMocks.createResponse()
  authenticate({ strategy: { name: 'test' }, storage })(request, response, next)
})

tap.todo('authentication - login error', function (test) {
  stubs.passport.authenticate = passportAuth
  const next = err => {
    test.equals(err.message, 'Login failure')
    test.end()
  }
  const request = httpMocks.createRequest({
    method: 'POST',
    url: '/login',
    session: { id: 'thing' },
    query: { first: true },
    params: {}
  })
  const response = httpMocks.createResponse()
  const redirect = sinon.fake.returns(true)
  response.redirect = redirect
  const logIn = (testUser, callback) => {
    callback(new Error('Login failure'))
  }
  request.logIn = logIn
  authenticate({ strategy: { name: 'test' }, storage })(request, response, next)
})
