const { get } = require('./api-get.js')
const { toBookCard } = require('../state/toBookCard.js')
const { toBookCardAttribution } = require('../state/toBookCardAttribution.js')
const { arrify } = require('./arrify.js')
const debug = require('debug')('vonnegut:utils:get-book-state')

async function getBookState (req, res) {
  const token = req.user.token
  const id = `${process.env.DOMAIN}/${req.params.bookId}`
  const result = await get(id, token)
  debug(result)
  if (result === null) {
    return result
  }
  const book = toBookCard(result)
  book.attributions = arrify(result.attributedTo).map(attribution => {
    return toBookCardAttribution(result, attribution)
  })
  debug(req.params)
  let chapter
  if (req.params[0]) {
    chapter = book.documents[req.params[0]]
  } else {
    chapter = book.documentsById[book.orderedItems[0].id]
  }
  return {chapter, book}
}

module.exports.getBookState = getBookState
