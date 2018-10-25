// @flow
/*::
import type {Publication, Note} from './types.js.flow'
*/
/**
 * Filters the publication's attachments to an array that only includes Notes
 */
const { arrify } = require('../utils/arrify.js')
function getNotes (publication /*: Publication */) /*: Note[] */ {
  return arrify(publication.attachment).filter(
    attachment => attachment.type === 'Note'
  )
}

module.exports.getNotes = getNotes
