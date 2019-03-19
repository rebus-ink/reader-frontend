import {getPath} from './utils.js'

export async function parseNav (props) {
  // Find the HTML nav file for EPUB 3.0+
  const htmlNavItem = props.opfDoc.querySelector('[properties~=nav]')
  if (htmlNavItem) {
    const htmlNavEntry = props.zip.file(
      decodeURI(getPath(htmlNavItem.getAttribute('href'), props))
    )
    props.htmlNav = htmlNavEntry ? await htmlNavEntry.async('string') : null
  }
  // Find the NCX nav file if we don't have an HTML nav
  if (!props.htmlNav) {
    const ncxId = props.opfDoc.querySelector('spine').getAttribute('toc')
    const ncxPath = getPath(
      props.opfDoc.getElementById(ncxId).getAttribute('href'),
      props
    )
    props.ncx = await props.zip.file(decodeURI(ncxPath)).async('string')
  }
  // Parse NCX file into HTML
  // We are going to be generating a TOC from the chapters themselves in the prototype A so getting a proper ToC is not a priority for this release
  props.bookPrefix = `${Math.random()
    .toFixed(8)
    .replace('.', '')}/`
  return props
}
