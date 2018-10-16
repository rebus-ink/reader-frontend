// @flow
/*::
import type {Attribution, Publication, BookCardAttribution} from './types.js.flow'
*/
/**
 * Converts an ActivityStreams attribution to an BookCard-attribution with easily accessible roles.
 */
const standardRoles = [
  'artist',
  'author',
  'colorist',
  'contributor',
  'creator',
  'editor',
  'illustrator',
  'inker',
  'letterer',
  'penciler',
  'publisher',
  'readBy',
  'translator'
]
function toBookCardAttribution (
  publication /*: Publication */,
  attribution /*: Attribution */
) /*: BookCardAttribution */ {
  const publicationRoles = Object.keys(publication).filter(
    key => standardRoles.indexOf(key.replace('schema:', '')) !== -1
  )
  const roles = []
  publicationRoles.forEach(role => {
    const id = publication[role]
    if (id === attribution.id || id === attribution.name) {
      roles.push(role)
    }
  })
  return {
    id: attribution.id,
    name: attribution.name,
    roles
  }
}

module.exports.toBookCardAttribution = toBookCardAttribution
