
// const activityTemplate = {
//   '@context': [
//     'https://www.w3.org/ns/activitystreams',
//     { reader: 'https://rebus.foundation/ns/reader' }
//   ]
// }

const BUCKET_URL = 'https://storage.googleapis.com/rebus-default-bucket/'

// Context should be empty to begin with. Event should be a custom 'import:load' event. Its 'detail' property has only one property: 'file'
export async function load (context = {}, event) {
  // First we load the zip file and add it to the context. This loads it into memory so will fail with very large ebooks
  const {base64 = false, file} = event.detail
  context.zip = await window.JSZip.loadAsync(file, {base64})
  // Then we find the META-INF/container.xml information file. This file tells us where the actual OPF file is.
  const container = await context.zip.file('META-INF/container.xml').async('string')
  // I really shouldn't be using a regexp here but it works for the prototype. Should be replaced by proper parsing ASAP.
  const result = container.match(/full-path="([^"]+)"/)
  if (!result[1]) { throw new Error('No OPF path found') }
  // We save the full path to the opf
  context.opfPath = result[1]
  // Let's save the file name
  context.fileName = file.name
  return context
}

// Do we need a handleError action at some point? Or does that belong to the component using the actions?

// Do we need an unload action at some point? Or will de-referencing the context handle that?

// This action parses the OPF and gets nav files from the zip in context and parses them into the 'publication' property as a 'rebus:Publication' type.
export async function parse (context, event) {
  const parser = new window.DOMParser()
  // Get the OPF from the zip
  const opf = await context.zip.file(context.opfPath).async('string')
  // Parse the OPF into a DOM
  const opfDoc = context.opf = parser.parseFromString(opf, 'application/xml')
  const packageElement = opfDoc.querySelector('package')
  const idforid = packageElement.getAttribute('unique-identifier')
  context.identifier = getText(opfDoc.getElementById(idforid))
  // Knowing the language is important!
  context.lang = getText(opfDoc.querySelector('language'))
  // Discover if we're EPUB 2.0 or 3.0 or 3.1. This matters mostly for metadata details as _every_ single version handles metadata a bit differently. Thankfully we aren't supporting those metadata details in this release
  context.epubVersion = packageElement.getAttribute('version')
  // Get the basic title (we'll handle alternate titles and refinements at a later date)
  context.title = getText(opfDoc.querySelector('title'))
  // Find the HTML nav file for EPUB 3.0+
  const htmlNavItem = opfDoc.querySelector('[properties~=nav]')
  if (htmlNavItem) {
    const htmlNavEntry = context.zip.file(getPath(htmlNavItem.getAttribute('href')), context)
    context.htmlNav = htmlNavEntry ? await htmlNavEntry.async('string') : null
  }
  // Find the NCX nav file if we don't have an HTML nav
  if (!context.htmlNav) {
    const ncxId = opfDoc.querySelector('spine').getAttribute('toc')
    const ncxPath = getPath(opfDoc.getElementById(ncxId).getAttribute('href'), context)
    context.ncx = await context.zip.file(ncxPath).async('string')
  }
  // Parse NCX file into HTML
  // We are going to be generating a TOC from the chapters themselves in the prototype A so getting a proper ToC is not a priority for this release
  // Generate a unique file prefix: `:userId/:bookId`
  // Currently, client-side js doesn't have access to the user id (easy to fix later) so for prototype A we're just going to go for a random id for the book media
  context.bookPrefix = `book-${Date.now()}-${Math.random().toFixed(6).replace('.', '')}/`
  function getURL (path) {
    return new window.URL(context.bookPrefix + path, BUCKET_URL)
  }
  // Create reference full URL for OPF using media upload target URL and prefix
  // Currently hard-coded to the default bucket.
  context.opfURL = getURL(context.opfPath)

  // Goes through the resources and converts into a nice array of objects
  // Each resource has an `activity` property that is a stub Activity Document object based on its media type and info in OPF with a reference URL based on the OPF URL and the OPF reference. Will either need to use something other than Array.from or add a polyfill later on for older browsers
  context.attachment = Array.from(opfDoc.querySelectorAll('item')).map(item => {
    const path = getPath(item.getAttribute('href'), context)
    const href = getURL(path)
    const id = item.getAttribute('id')
    const properties = item.getAttribute('properties') || ''
    return {
      path,
      href,
      id,
      properties,
      mediaType: item.getAttribute('media-type')
    }
  }).map(itemToActivityStub)
  // Update HTML toc to use proper URLs
  // Not needed because we're ignoring the HTML toc for Prototype A
  // Converts reading order into orderedItems array, pulling the Activity Document stubs from the preliminary attachments array.
  // Possibly do this at a later stage when the activities are readier.
  context.orderedItems = Array.from(opfDoc.querySelectorAll('itemref')).map(element => {
    return context.attachment.filter(item => item.id === element.getAttribute('itemref'))[0]
  })
  // Gets the creators (specific roles in later release)
  // Contributors are a future feature
  context.attributedTo = Array.from(opfDoc.querySelectorAll('creator')).map(creator => {
    return {
      type: 'Person',
      name: creator.textContent
    }
  })
  // We need to then find the cover (which can be included in a variety of ways, unfortunately)
  const cover = context.attachment.filter((item) => {
    return item.properties.indexOf('cover-image') !== -1
  })[0]
  if (cover) {
    context.icon = {
      type: 'Image',
      url: cover.href,
      mediaType: cover.mediaType
    }
  }
  // Add link to final OPF destination URL as alternate
  // Add link to uploaded EPUB file as alternate
  context.url = [{
    type: 'Link',
    href: context.opfURL,
    rel: ['alternate'],
    mediaType: 'application/oebps-package+xml'
  }, {
    type: 'Link',
    href: getURL(context.fileName),
    rel: ['alternate'],
    mediaType: 'application/epub+zip'
  }]
  return context
}

// This action goes through all of the remaining files in the epub, processes them for type and adds them as attachments on the 'publication' property
export async function process (context, event) {
  // For each resource we...
  // Read it from the Zip file
  // Parse HTML files to update all URL references to point at the media upload URL for that document. Basically: 1. turn all relative URL into full using the current doc URL as base. 2. Parse src, href, srcset, xlink:href (for SVG) attributes for URLs, convert them to absolute that refer to actual uploaded path.
  // Long term, we should parse CSS files to do the same. But not today.
  // The contents of text-based files are added to their Activity Document object's `content` property
  return context
}

// This uploads the initial file and all attachments using the file upload endpoint.
export async function upload (context, event) {
  // At some point we will want to unmangle fonts. We aren't going to use them but it would be very useful for external clients.
  // Another future feature is getting media sizes as they are being uploaded
  // There are security implications for hosting unmodified html, css, and js files on a domain we control. This will be less of an issue once we have access control for uploaded media files
  return context
}

// Finally, this action submits the completed publication activity to the user's outbox.
export async function create (context, event) {
  // The the `publication` property in the context should now be a complete `rebus:Publication` activity.
  return context
}

function getText (node) {
  if (node) {
    return node.textContent
  } else {
    return ''
  }
}

function getPath (path, context) {
  try {
    const opf = new window.URL(context.opfPath, 'http://example.com/')
    // Return the full pathname, sans initial '/' as that confuses the zip
    return new window.URL(path, opf).pathname.replace('/', '')
  } catch (err) {
    console.log(err.message)
    return null
  }
}

function itemToActivityStub (item) {
  item.activity = {}
  if (item.mediaType.indexOf('image') !== -1) {
    item.activity.type = 'Image'
  } else if (item.mediaType.indexOf('audio') !== -1) {
    item.activity.type = 'Audio'
  } else if (item.mediaType.indexOf('video') !== -1) {
    item.activity.type = 'Video'
  } else {
    item.activity.type = 'Document'
  }
  item.activity.url = [{
    type: 'Link',
    href: item.href,
    rel: ['alternate'],
    mediaType: item.mediaType
  }]
  item.summary = `Resource of type ${item.mediaType}`
  return item
}
