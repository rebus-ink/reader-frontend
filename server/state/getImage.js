// @flow
/*::
import type {Icon} from './types.js.flow'
*/
function getImage (maybeImage /*: any */, placeholder /*: Icon */) /*: Icon */ {
  let image
  if (typeof maybeImage === 'string') {
    image = { type: 'Image', url: maybeImage }
  } else if (maybeImage && maybeImage.url) {
    image = maybeImage
  } else {
    image = placeholder
  }
  return image
}

module.exports.getImage = getImage
