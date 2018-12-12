const BUCKET_URL = 'https://storage.googleapis.com/rebus-default-bucket/'

// Context should be empty to begin with. Event should be a custom 'import:load' event. Its 'detail' property has only one property: 'file'
export async function load (context = {}, event) {
  // First we load the zip file and add it to the context. This loads it into memory so will fail with very large ebooks
  const {base64 = false, file, DOMAIN} = event.detail
  context.file = file
  context.DOMAIN = DOMAIN
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
export async function parse (context) {
  const parser = new window.DOMParser()
  // Get the OPF from the zip
  const opf = await context.zip.file(context.opfPath).async('string')
  // Parse the OPF into a DOM
  let opfDoc = context.opf = parser.parseFromString(opf, 'application/xml')
  if (opfDoc.querySelector('parsererror')) {
    opfDoc = context.opf = parser.parseFromString(opf, 'text/html')
    context.lang = getText(opfDoc.querySelector('dc\\:language'))
    context.title = getText(opfDoc.querySelector('dc\\:title'))
  } else {
    context.lang = getText(opfDoc.querySelector('language'))
    // Get the basic title (we'll handle alternate titles and refinements at a later date)
    context.title = getText(opfDoc.querySelector('title'))
  }
  const packageElement = opfDoc.querySelector('package')
  const idforid = packageElement.getAttribute('unique-identifier')
  context.identifier = getText(opfDoc.getElementById(idforid))
  // Discover if we're EPUB 2.0 or 3.0 or 3.1. This matters mostly for metadata details as _every_ single version handles metadata a bit differently. Thankfully we aren't supporting those metadata details in this release
  context.epubVersion = packageElement.getAttribute('version')
  // Find the HTML nav file for EPUB 3.0+
  const htmlNavItem = opfDoc.querySelector('[properties~=nav]')
  if (htmlNavItem) {
    const htmlNavEntry = context.zip.file(getPath(htmlNavItem.getAttribute('href'), context))
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
  context.bookPrefix = `${Math.random().toFixed(8).replace('.', '')}-`
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
    const href = getURL(path).href
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
  // This adds 'schema:position' to each activity. The API server has to use this to generate the `orderedItems` property as we cannot do so during import. Each item in the `orderedItems` property needs to refer to the id of a document in `attachment` but those ids don't exist until the document has been created serverside. So we need another mechanism.
  const itemRefs = Array.from(opfDoc.querySelectorAll('itemref:not([linear="no"])'))
  itemRefs.forEach((element, index) => {
    const item = context.attachment.filter(item => {
      return item.id === element.getAttribute('idref')
    })[0]
    item.activity['position'] = index
  })
  context.totalItems = itemRefs.length
  // Gets the creators (specific roles in later release)
  // Contributors are a future feature
  context.attributedTo = Array.from(opfDoc.querySelectorAll('creator')).map(creator => {
    return {
      type: 'Person',
      name: creator.textContent
    }
  })
  // We need to then find the cover (which can be included in a variety of ways, unfortunately)
  const propertiesCover = context.attachment.filter((item) => {
    return item.properties.indexOf('cover-image') !== -1
  })[0]
  const metaCover = opfDoc.querySelector('meta[name="cover"]')
  const guideCover = opfDoc.querySelector('guide reference[type="cover"]')
  const linearCover = opfDoc.querySelector('itemref[linear="no"]')
  let cover
  if (propertiesCover) {
    cover = propertiesCover
  } else if (metaCover) {
    cover = context.attachment.filter((item) => {
      return item.id === metaCover.getAttribute('content')
    })[0]
  } else if (guideCover) {
    const coverHTML = context.attachment.filter((item) => {
      return item.path === getPath(guideCover.getAttribute('href'), context)
    })[0]
    if (coverHTML && coverHTML.path) {
      const file = await context.zip.file(coverHTML.path).async('string')
      const fileDoc = parser.parseFromString(file, 'text/html')
      const imageEl = fileDoc.querySelector('img')
      if (imageEl) {
        const src = imageEl.getAttribute('src')
        const url = new window.URL(src, coverHTML.href).href
        cover = context.attachment.filter((item) => {
          return item.href === url
        })[0]
      }
    }
  } else if (linearCover) {
    const item = context.attachment.filter(item => {
      return item.id === linearCover.getAttribute('idref')
    })[0]
    if (item && item.path) {
      const file = await context.zip.file(item.path).async('string')
      const fileDoc = parser.parseFromString(file, 'text/html')
      const imageEl = fileDoc.querySelector('img')
      if (imageEl) {
        const src = imageEl.getAttribute('src')
        const url = new window.URL(src, item.href).href
        cover = context.attachment.filter((item) => {
          return item.href === url
        })[0]
      }
    }
  }
  if (cover) {
    context.cover = cover
  }
  // Add link to final OPF destination URL as alternate
  // Add link to uploaded EPUB file as alternate
  context.url = [{
    type: 'Link',
    href: getURL(context.fileName),
    rel: ['alternate'],
    mediaType: 'application/epub+zip'
  }]
  return context
}

// This action goes through all of the remaining html files in the epub, processes them for type
export async function process (context, event) {
  // Get the zip
  const zip = context.zip
  const parser = new window.DOMParser()
  // For each resource we...
  for (var index = 0; index < context.attachment.length; index++) {
    const resource = context.attachment[index]
    // Read it from the Zip file
    if (resource.mediaType === 'application/xhtml+xml') {
      console.log(resource)
      const file = await zip.file(decodeURI(resource.path)).async('string')
      resource.activity.content = file
      // Just going to use this to extract data, hence the 'text/html'
      const fileDoc = parser.parseFromString(file, 'text/html')
      // Let's get the name! The first H1 would be the most sensible place to find it
      const h1text = getText(fileDoc.querySelector('h1'))
      // But sometimes book CMSes are extremely borked
      const h2text = getText(fileDoc.querySelector('h2'))
      // And they almost never have useful text in their title tags (you'd think they'd add something useful, but you'd be wrong). Let's grab it as a fallback anwyway.
      const titleText = getText(fileDoc.querySelector('title'))
      resource.activity.name = h1text || h2text || titleText
    }
  }
  return context
}

// This uploads the initial file and all attachments using the file upload endpoint.
export async function upload (context, event) {
  const uploadFile = window.uploadFile
  const zip = context.zip
  // Another future feature is getting media sizes as they are being uploaded
  // There are security implications for hosting unmodified html, css, and js files on a domain we control. So, we're only going to upload images and media. The long term solution is to sanitize the svg
  // To upload, blobs need to be turned into File objects and added to a FormData object which becomes the payload.
  // First upload the epub.
  try {
    const data = new window.FormData()
    const file = new window.File([context.file], context.bookPrefix + context.file.name, {type: 'application/epub+zip'})
    data.append('file', file)
    await uploadFile(data)
  } catch (err) {
    console.log(err.response)
  }
  // Then cycle through the attachments and upload images, audio, video
  for (var index = 0; index < context.attachment.length; index++) {
    const resource = context.attachment[index]
    if (resource.mediaType.startsWith('image') || resource.mediaType.startsWith('audio') || resource.mediaType.startsWith('video')) {
      const blob = await zip.file(resource.path).async('blob')
      const file = new window.File([blob], context.bookPrefix + resource.path, {type: resource.mediaType})
      const data = new window.FormData()
      data.append('file', file)
      try {
        const result = await uploadFile(data)
        if (result.url) {
          resource.activity.url[0].href = result.url
        }
        console.log(resource.activity.url[0], result.url)
      } catch (err) {
        console.log(err)
      }
    }
  }
  if (context.cover && context.cover.activity && context.cover.activity.url && context.cover.activity.url[0]) {
    context.icon = {
      type: 'Image',
      summary: 'EPUB Cover',
      url: context.cover.activity.url[0].href,
      mediaType: context.cover.mediaType
    }
  }
  return context
}

// Finally, this action prepares and submits the completed publication activity to the user's outbox.
export async function create (context, event) {
  const createPublication = window.createPublication
  const publication = {
    type: 'reader:Publication',
    name: context.title
  }
  publication.attachment = context.attachment.map(item => item.activity)
  // The the `publication` property in the context should now be a complete `rebus:Publication` activity.
  publication.totalItems = context.totalItems
  publication.attributedTo = context.attributedTo
  if (context.icon) {
    publication.icon = context.icon
  }
  publication.url = context.url
  const wrapper = {
    '@context': [
      'https://www.w3.org/ns/activitystreams',
      { reader: 'https://rebus.foundation/ns/reader', schema: 'https://schema.org/' }
    ],
    type: 'Create',
    object: publication
  }
  return createPublication(wrapper)
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
  item.activity['reader:path'] = item.path
  return item
}

window.actions = {load, parse, process, upload, create}
