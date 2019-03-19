import {getParser} from '../context.js'
import {getText} from './utils.js'

export async function parseOPF (props) {
  const parser = getParser()
  const opf = await props.zip.file(props.opfPath).async('string')
  let opfDoc = (props.opf = parser.parseFromString(opf, 'application/xml'))
  if (opfDoc.querySelector('parsererror')) {
    opfDoc = props.opf = parser.parseFromString(opf, 'text/html')
    props.lang = getText(opfDoc.querySelector('dc\\:language'))
    props.name = getText(opfDoc.querySelector('dc\\:title'))
  } else {
    props.lang = getText(opfDoc.querySelector('language'))
    // Get the basic title (we'll handle alternate titles and refinements at a later date)
    props.name = getText(opfDoc.querySelector('title'))
  }
  const packageElement = opfDoc.querySelector('package')
  const idforid = packageElement.getAttribute('unique-identifier')
  props.identifier = getText(opfDoc.getElementById(idforid))
  // Discover if we're EPUB 2.0 or 3.0 or 3.1.
  props.epubVersion = packageElement.getAttribute('version')
  props.opfDoc = opfDoc
  return props
}
