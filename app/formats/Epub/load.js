import {getGlobals} from '../context.js'
import {parseOPF} from './parseOPF.js'
import {parseNav} from './parseNav.js'
import {parseResources} from './parseResources.js'
import {parseOrder} from './parseOrder.js'
import {parseCover} from './parseCover.js'
// import {process} from './process.js'

export async function load (props, event) {
  const context = getGlobals()
  // Should check for src prop and download epub if file is not present.
  // Should also check for activity prop in case we have an id for annotations
  // Need to figure out a way to handle three scenarios: import file, import URL, read from url cached in file: file, src, activity. Set during init. initAsync only called during import preview or during book read.
  // Book object only created during import or read. Listings are still activities.
  const { base64 = false, file, DOMAIN = '/', fileName } = event.detail
  props.file = file
  props.DOMAIN = DOMAIN
  props.zip = await context.JSZip.loadAsync(file, { base64 })
  const container = await props.zip
    .file('META-INF/container.xml')
    .async('string')
  const result = container.match(/full-path="([^"]+)"/)
  if (!result[1]) {
    throw new Error('No OPF path found')
  }
  // We save the full path to the opf
  props.opfPath = result[1]
  // Let's save the file name
  props.fileName = file.name || fileName
  props = await parseOPF(props)
  props = await parseNav(props)
  props = await parseResources(props)
  props = await parseOrder(props)
  props = await parseCover(props)
  props.url = [
    {
      type: 'Link',
      href: props.DOMAIN + props.fileName,
      rel: ['alternate'],
      mediaType: 'application/epub+zip'
    },
    {
      type: 'Link',
      href: props.DOMAIN + props.opfPath,
      rel: ['alternate'],
      mediaType: 'application/oebps-package+xml'
    }
  ]
  // props = process(props)
  return props
}
