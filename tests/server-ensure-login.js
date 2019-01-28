const tap = require('tap')
const sinon = require('sinon')
const { ensureLogin } = require('../server/ensure-login.js')
const httpMocks = require('node-mocks-http')

tap.test('server-ensure-login', test => {
  const next = sinon.fake.returns(true)
  const request = httpMocks.createRequest({
    method: 'POST',
    url: '/library',
    session: { id: 'thing' },
    query: { first: true },
    params: {}
  })
  const response = httpMocks.createResponse()
  test.doesNotThrow(ensureLogin.bind(null, request, response, next))
  test.end()
})

tap.test('server-ensure-login - with user', test => {
  const next = sinon.fake.returns(true)
  const request = httpMocks.createRequest({
    method: 'POST',
    url: '/library',
    user: { id: 'fake-user' },
    session: { id: 'thing' },
    query: { first: true },
    params: {}
  })
  const response = httpMocks.createResponse()
  test.doesNotThrow(ensureLogin.bind(null, request, response, next))
  test.ok(next.calledOnce)
  test.end()
})
