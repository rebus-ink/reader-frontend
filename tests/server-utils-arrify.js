const tap = require('tap')
const { arrify } = require('../server/utils/arrify.js')

tap.test('getStacks - array', function (test) {
  const testData = {
    attachment: [
      { type: 'Document', content: '' },
      { type: 'rebus:Stack', content: '' }
    ]
  }
  const notes = arrify(testData.attachment)
  test.equals(notes.length, 2)
  test.equals(notes[1].type, 'rebus:Stack')
  test.end()
})

tap.test('getStacks - no array', function (test) {
  const testData = {}
  const notes = arrify(testData.attachment)
  test.equals(notes.length, 0)
  test.end()
})

tap.test('getStacks - object', function (test) {
  const testData = {
    attachment: { type: 'Document', content: '' }
  }
  const notes = arrify(testData.attachment)
  test.ok(notes.length)
  test.equals(notes.length, 1)
  test.end()
})
