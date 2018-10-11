const tap = require('tap')
const sinon = require('sinon')
const proxyquire = require('proxyquire')
const fakeResult = { id: 'test', type: 'Collection' }
const fakeGot = sinon.fake.returns(Promise.resolve({ body: fakeResult }))
const stubs = {
  got: fakeGot
}
const { get } = proxyquire('../server/api-get.js', stubs)

tap.test('api-get', async function (test) {
  const result = await get('https://example.com/')
  test.equals(result, fakeResult)
})
tap.test('api-get - with token', async function (test) {
  const result = await get('https://example.com/', 'randomtoken')
  test.equals(result, fakeResult)
})

tap.test('api-get - errors', async function (test) {
  stubs.got = function () {
    throw new Error('Kaboom!')
  }
  const { get } = proxyquire('../server/api-get.js', stubs)
  const result = await get('https://example.com/')
  test.notOk(result)
})
