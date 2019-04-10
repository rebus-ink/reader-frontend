const { get } = require('./api-get.js')
const { toBookCard } = require('../state/toBookCard.js')
const debug = require('debug')('vonnegut:utils:get-book-state')

async function getBookState (req, res) {
  const token = req.user.token
  const id = `${process.env.DOMAIN}/${req.params.bookId}`
  debug(id)
  const result = await get(id, token)
  // debug(result)
  if (result === null) {
    return result
  }
  const book = toBookCard(result)
  let chapter
  if (req.params[0] && book.documents[req.params[0]]) {
    chapter = book.documents[req.params[0]]
  } else {
    chapter = book.orderedItems[0]
  }
  debug('chapter got')
  return { chapter, book }
}

module.exports.getBookState = getBookState
