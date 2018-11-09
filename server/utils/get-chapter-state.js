const { get } = require('./api-get.js')
const { getBookState } = require('./get-book-state.js')
const { arrify } = require('./arrify.js')

async function getChapterState (req, res) {
  const book = await getBookState(req, res)
  const token = req.user.token
  const { chapter = 0 } = req.params
  const chapterListing = arrify(book.orderedItems)[chapter]
  const id = chapterListing.id
  const result = await get(id, token)
  if (result === null) {
    return result
  }
  return {
    book,
    chapter: result
  }
}

module.exports.getChapterState = getChapterState
