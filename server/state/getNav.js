const { arrify } = require('../utils/arrify.js')
const debug = require('debug')('vonnegut:state:getNav')

function getNav (publication, req) {
  const currentPath = req.params[0]
  debug(currentPath)
  const items = arrify(publication.orderedItems)
  const current = items.filter(chapter => {
    return currentPath === decodeURIComponent(chapter['reader:path'])
  })[0]
  debug(current)
  const index = items.indexOf(current)
  const previous = items[index - 1]
  const next = items[index + 1]
  return {
    current,
    previous,
    next
  }
}

module.exports.getNav = getNav
