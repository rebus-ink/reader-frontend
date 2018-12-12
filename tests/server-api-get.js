const tap = require('tap')
const sinon = require('sinon')
const proxyquire = require('proxyquire')
const fakeResult = `{ "id": "test", "type": "Collection" }`
const fakeParsedResult = JSON.parse(fakeResult)
const fakeGot = sinon.fake.returns(Promise.resolve({ body: fakeResult }))
const stubs = {
  got: fakeGot
}
if (!process.env.DOMAIN) {
  process.env.DOMAIN = 'https://localhost:4340/api/'
}
const { get } = proxyquire('../server/utils/api-get.js', stubs)

tap.test('api-get', async function (test) {
  const result = await get('https://example.com/')
  test.matches(result, fakeParsedResult)
})
tap.test('api-get - with token', async function (test) {
  const result = await get('https://example.com/', 'randomtoken')
  test.matches(result, fakeParsedResult)
})

tap.test('api-get - errors', async function (test) {
  stubs.got = function () {
    throw new Error('Kaboom!')
  }
  const { get } = proxyquire('../server/utils/api-get.js', stubs)
  return get('https://example.com/').catch(err => {
    test.equals(err.message, 'Kaboom!')
  })
})
