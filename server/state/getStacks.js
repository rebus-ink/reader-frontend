// @flow
/*::
import type {Publication, Stack} from './types.js.flow'
*/
/**
 * Filters the publication's tag to an array that only includes rebus:Stack activities
 */
const { arrify } = require('../utils/arrify.js')
function getStacks (publication /*: Publication */) /*: Stack[] */ {
  return arrify(publication.tag).filter(tag => tag.type === 'rebus:Stack')
}

module.exports.getStacks = getStacks
