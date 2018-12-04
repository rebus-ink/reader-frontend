const { get } = require('./api-get.js')
const { toBookCard } = require('../state/toBookCard.js')
const { toBookCardAttribution } = require('../state/toBookCardAttribution.js')
const { arrify } = require('./arrify.js')

async function getBookState (req, res) {
  const token = req.user.token
  const id = `${process.env.API_DOMAIN}/${req.params.bookId}`
  const result = await get(id, token)
  if (result === null) {
    return result
  }
  const book = toBookCard(result)
  book.attributions = arrify(result.attributedTo).map(attribution => {
    return toBookCardAttribution(result, attribution)
  })
  let chapter
  if (req.params.filePath) {
    chapter = book.documents[req.params.filePath]
  } else {
    chapter = book.documentsById[book.orderedItems[0].id]
  }
  return {chapter, book}
}

module.exports.getBookState = getBookState
