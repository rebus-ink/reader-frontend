const tap = require('tap')

const { toBookCard } = require('../server/state/toBookCard.js')
tap.test('toBookCard', function (test) {
  const testPublication = {
    type: 'Publication',
    actor: 'Blooper',
    illustrator: 'John Doe',
    name: 'Fake Publication',
    id: 'https://example.com/testPublication',
    author: 'The Real Author',
    'schema:image': {
      type: 'Image',
      summary: '',
      width: 250,
      height: 350,
      url: 'https://example.com/cover'
    }
  }
  const bookCard = toBookCard(testPublication)
  test.equals(bookCard.name, 'Fake Publication')
  test.end()
})
tap.test('toBookCard - no name, no schema:image', function (test) {
  const testPublication = {
    type: 'Publication',
    actor: 'Blooper',
    illustrator: 'John Doe',
    id: 'https://example.com/testPublication',
    author: 'The Real Author',
    icon: {
      type: 'Image',
      width: 250,
      height: 350,
      url: 'https://example.com/cover'
    }
  }
  const bookCard = toBookCard(testPublication)
  test.equals(bookCard.name, '')
  test.end()
})
