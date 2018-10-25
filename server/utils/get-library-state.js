const { get } = require('./api-get.js')
const { toBookCard } = require('../state/toBookCard.js')
const { toBookCardAttribution } = require('../state/toBookCardAttribution.js')
const { arrify } = require('./arrify.js')

async function getLibraryState (req, res) {
  const token = req.user.token
  const library = req.user.streams.library
  const result = await get(library, token)
  if (result === null) {
    return result
  }
  const books = result.items.map(publication => {
    const bookCard = toBookCard(publication)
    bookCard.attributions = arrify(publication.attributedTo).map(
      attribution => {
        return toBookCardAttribution(publication, attribution)
      }
    )
  })
  return { books }
}

module.exports.getLibraryState = getLibraryState
