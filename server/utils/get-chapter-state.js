const { get } = require('./api-get.js')
const { getBookState } = require('./get-book-state.js')
const { arrify } = require('./arrify.js')

async function getChapterState (req, res) {
  const book = await getBookState(req, res)
  const token = req.user.token
  const { chapterNumber = 0 } = req.params.chapter
  const chapterListing = arrify(book.orderedItems)[chapterNumber]
  const id = chapterListing.id
  const result = await get(id, token)
  if (result === null) {
    return result
  }
  const chapter = arrify(book.orderedItems)[req.params.chapter]
  return {
    book,
    chapter
  }
}

module.exports.getChapterState = getChapterState
