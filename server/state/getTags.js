// @flow
/*::
import type {Publication, HashTag} from './types.js.flow'
*/
/**
 * Filters the publication's tag to an array that only includes as:HashTag activities
 */
const { arrify } = require('../utils/arrify.js')
function getTags (publication /*: Publication */) /*: HashTag[] */ {
  return arrify(publication.tag).filter(tag => tag.type === 'as:HashTag')
}

module.exports.getTags = getTags
