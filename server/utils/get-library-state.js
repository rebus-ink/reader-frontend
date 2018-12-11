const { get } = require('./api-get.js')
const { toBookCard } = require('../state/toBookCard.js')
const { toBookCardAttribution } = require('../state/toBookCardAttribution.js')
const { arrify } = require('./arrify.js')
const debug = require('debug')('vonnegut:utils:get-library-state')

async function getLibraryState (req, res) {
  const token = req.user.token
  const library = req.user.streams.library
  let result
  try {
    result = await get(library, token)
  } catch (err) {
    debug(err)
    throw err
  }
  if (!result) {
    return result
  }
  const books = result.items.map(publication => {
    const bookCard = toBookCard(publication)
    bookCard.attributions = arrify(publication.attributedTo).map(
      attribution => {
        return toBookCardAttribution(publication, attribution)
      }
    )
    return bookCard
  })
  debug('got library')
  return { books }
}

module.exports.getLibraryState = getLibraryState
