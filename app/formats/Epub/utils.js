import {getGlobals} from '../context.js'

export function getPath (path, props) {
  const context = getGlobals()
  try {
    const opf = new context.URL(props.opfPath, 'http://example.com/')
    // Return the full pathname, sans initial '/' as that confuses the zip
    return new context.URL(path, opf).pathname.replace('/', '')
  } catch (err) {
    return null
  }
}
export function getText (node) {
  if (node) {
    return node.textContent
  } else {
    return ''
  }
}
