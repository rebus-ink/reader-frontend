const tap = require('tap')

const { getNotes } = require('../server/state/getNotes.js')
tap.test('getNotes', function (test) {
  const notes = getNotes({
    attachment: [
      { type: 'Document', content: '' },
      { type: 'Note', content: '' }
    ]
  })
  test.equals(notes.length, 1)
  test.equals(notes[0].type, 'Note')
  test.end()
})

const { getStacks } = require('../server/state/getStacks.js')
tap.test('getStacks', function (test) {
  const stacks = getStacks({
    tag: [
      { type: 'Document', content: '' },
      { type: 'rebus:Stack', content: '' }
    ]
  })
  test.equals(stacks.length, 1)
  test.equals(stacks[0].type, 'rebus:Stack')
  test.end()
})

const { getTags } = require('../server/state/getTags.js')
tap.test('getTags', function (test) {
  const stacks = getTags({
    tag: [
      { type: 'Document', content: '' },
      { type: 'as:HashTag', content: '' }
    ]
  })
  test.equals(stacks.length, 1)
  test.equals(stacks[0].type, 'as:HashTag')
  test.end()
})

const { getToC } = require('../server/state/getToC.js')
tap.test('getToC', function (test) {
  const contents = getToC({
    tag: [
      { type: 'Link', rel: 'contents', href: 'https://example.com/ToC' },
      { type: 'as:HashTag', content: '' }
    ],
    attachment: [
      { type: 'Document', id: 'https://example.com/ToC' },
      { type: 'Document', id: 'https://example.com/notAToC' }
    ]
  })
  test.equals(contents.id, 'https://example.com/ToC')
  test.end()
})

const { getCover } = require('../server/state/getCover.js')
tap.test('getCover', function (test) {
  const placeholdercover = {
    type: 'Image',
    summary: '',
    width: 250,
    height: 350,
    url: '/static/placeholder-cover.png'
  }
  const testData = {
    tag: [
      { type: 'Link', rel: 'contents', href: 'https://example.com/ToC' },
      { type: 'as:HashTag', content: '' }
    ],
    attachment: [
      { type: 'Image', id: 'https://example.com/smallIcon' },
      {
        type: 'Image',
        id: 'https://example.com/cover',
        width: 400,
        height: 400
      }
    ]
  }
  const contents = testData.attachment.reduce(getCover, placeholdercover)
  test.equals(contents.id, 'https://example.com/cover')
  test.end()
})

const { getImage } = require('../server/state/getImage.js')
tap.test('getImage', function (test) {
  const placeholdercover = {
    type: 'Image',
    summary: '',
    width: 250,
    height: 350,
    url: '/static/placeholder-cover.png'
  }
  const maybeImage = {
    type: 'Image',
    summary: '',
    width: 250,
    height: 350,
    url: 'https://example.com/cover'
  }
  const image = getImage(maybeImage, placeholdercover)
  test.equals(image.url, 'https://example.com/cover')
  test.end()
})
tap.test('getImage', function (test) {
  const placeholdercover = {
    type: 'Image',
    summary: '',
    width: 250,
    height: 350,
    url: '/static/placeholder-cover.png'
  }
  const maybeImage = 'https://example.com/cover'
  const image = getImage(maybeImage, placeholdercover)
  test.equals(image.url, 'https://example.com/cover')
  test.end()
})
tap.test('getImage', function (test) {
  const placeholdercover = {
    type: 'Image',
    summary: '',
    width: 250,
    height: 350,
    url: '/static/placeholder-cover.png'
  }
  const maybeImage = null
  const image = getImage(maybeImage, placeholdercover)
  test.equals(image.url, '/static/placeholder-cover.png')
  test.end()
})

const {
  toBookCardAttribution
} = require('../server/state/toBookCardAttribution.js')
tap.test('toBookCardAttribution', function (test) {
  const testPublication = {
    type: 'Publication',
    actor: 'Blooper',
    illustrator: 'John Doe',
    name: 'Fake Publication',
    author: 'The Real Author'
  }
  const attribution = toBookCardAttribution(testPublication, {
    name: 'The Real Author',
    id: 'https://example.com/authorId'
  })
  test.equals(attribution.id, 'https://example.com/authorId')
  test.end()
})
tap.test('toBookCardAttribution - find by id', function (test) {
  const testPublication = {
    type: 'Publication',
    actor: 'Blooper',
    illustrator: 'John Doe',
    name: 'Fake Publication',
    author: 'https://example.com/authorId'
  }
  const attribution = toBookCardAttribution(testPublication, {
    name: 'Another Author',
    id: 'https://example.com/authorId'
  })
  test.equals(attribution.id, 'https://example.com/authorId')
  test.end()
})

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
  test.equals(bookCard.cover.url, 'https://example.com/cover')
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
  test.equals(bookCard.cover.url, 'https://example.com/cover')
  test.end()
})
