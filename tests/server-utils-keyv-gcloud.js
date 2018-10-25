// // This requires you to set up Google Cloud authentication separately (or not at all, if you're deploying to gcloud)
// const tap = require('tap')
// const Datastore = require('@google-cloud/datastore')
// const namespace = 'GKeyV-test'
// const datastore = new Datastore({
//   namespace
// })
// const { GKeyV } = require('../server/utils/gkeyv.js')
// const Keyv = require('keyv')
// const store = new Keyv({
//   store: new GKeyV({ datastore }),
//   namespace
// })
// const tk = require('timekeeper')

// tap.test('GKeyV - set', async test => {
//   const result = await store.set('testkey', 'This is a test value')
//   test.ok(result)
//   await store.delete('testkey')
// })

// tap.test('GKeyV - set, expired', async test => {
//   await store.set('testexpired', 'This is a test value', 100)
//   tk.freeze(Date.now() + 150)
//   const result = await store.get('testexpired')
//   test.notOk(result)
//   tk.reset()
//   await store.delete('testexpired')
// })

// tap.test('GKeyV - delete', async test => {
//   await store.set('testdelete', 'This is a test value')
//   const result = await store.delete('testdelete')
//   test.ok(result)
//   const result2 = await store.get('testdelete')
//   test.notOk(result2)
// })

// tap.test('GKeyV - get', async test => {
//   await store.set('testget', 'This is a test value')
//   const result = await store.get('testget')
//   test.equals(result, 'This is a test value')
//   await store.delete('testget')
// })

// tap.test('GKeyV - clear', async test => {
//   await store.set('testclear1', 'This is a test value')
//   await store.set('testclear2', 'This is a test value')
//   await store.set('testclear3', 'This is a test value')
//   await store.clear()
//   test.notOk(await store.get('testclear1'))
//   test.notOk(await store.get('testclear2'))
//   test.notOk(await store.get('testclear3'))
// })
