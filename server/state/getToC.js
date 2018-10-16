// @flow
/*::
import type {Publication, PublicationDocument} from './types.js.flow'
*/
/**
 * Filters the publication's attachments to find the publication's Table of Contents
 */
const { arrify } = require('../utils/arrify.js')
function getToC (publication /*: Publication */) /*: ?PublicationDocument */ {
  const contents = arrify(publication.tag)
    .filter(tag => tag.rel === 'contents')
    .map(tag => tag.href)
  return arrify(publication.attachment).filter(
    doc => contents.indexOf(doc.id) !== -1
  )[0]
}

module.exports.getToC = getToC
