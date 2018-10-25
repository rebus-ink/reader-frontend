// @flow
/*::
import type {Icon} from './types.js.flow'
*/
function getCover (result /*: Icon */, current /*: Icon */) /*: Icon */ {
  // Need to check that the image is of a size we need and of the correct type, otherwise keep whatever we have.
  if (
    current.type === 'Image' &&
    (current.width && current.width >= 248) &&
    (current.height && current.height >= 248)
  ) {
    return current
  } else {
    return result
  }
}

module.exports.getCover = getCover
