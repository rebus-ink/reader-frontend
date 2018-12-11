const { get } = require('./api-get.js')
const { toBookCard } = require('../state/toBookCard.js')
const { toBookCardAttribution } = require('../state/toBookCardAttribution.js')
const { arrify } = require('./arrify.js')
const debug = require('debug')('vonnegut:utils:get-book-state')

async function getBookState (req, res) {
  const token = req.user.token
  const id = `${process.env.DOMAIN}${req.params.bookId}`
  debug(id)
  const result = await get(id, token)
  // debug(result)
  if (result === null) {
    return result
  }
  const book = toBookCard(result)
  book.attributions = arrify(result.attributedTo).map(attribution => {
    return toBookCardAttribution(result, attribution)
  })
  let chapterID
  if (req.params[0]) {
    chapterID = book.documents[req.params[0]].id
  } else {
    chapterID = book.orderedItems[0].id
  }
  const chapter = await get(chapterID, token)
  return {chapter, book}
}

module.exports.getBookState = getBookState
