import { getText } from './utils.js'

export async function parseOPF (opf, opfPath, api, global) {
  let book = {
    type: 'Publication',
    links: [],
    resources: [],
    readingOrder: [],
    json: {}
  }
  const parser = new global.DOMParser()
  let opfDoc = parser.parseFromString(opf, 'application/xml')

  // Let's get the language and name
  if (opfDoc.querySelector('parsererror')) {
    opfDoc = parser.parseFromString(opf, 'text/html')
    book.inLanguage = getText(opfDoc.querySelector('dc\\:language'))
    book.name = getText(opfDoc.querySelector('dc\\:title'))
  } else {
    book.inLanguage = getText(opfDoc.querySelector('language'))
    // Get the basic title (we'll handle alternate titles and refinements at a later date)
    book.name = getText(opfDoc.querySelector('title'))
  }

  // Other basics
  const packageElement = opfDoc.querySelector('package')
  const idforid = packageElement.getAttribute('unique-identifier')
  book.identifier = getText(opfDoc.getElementById(idforid))
  book.json.epubVersion = packageElement.getAttribute('version')
  const ncxId = opfDoc.querySelector('spine').getAttribute('toc')

  // The book's resources
  book.resources = Array.from(opfDoc.querySelectorAll('item')).map(item => {
    const properties = item.getAttribute('properties') || ''
    const rel = []
    if (properties && properties.indexOf('cover-image') !== -1) {
      rel.push('cover')
    }
    if (properties && properties.indexOf('nav') !== -1) {
      rel.push('contents')
    }
    const id = item.getAttribute('id')
    if (id === ncxId) {
      rel.push('ncx')
    }
    return {
      url: getPath(item.getAttribute('href'), opfPath, global),
      rel,
      id,
      encodingFormat: item.getAttribute('media-type')
    }
  })

  // Often the cover isn't marked up using properties
  const propertiesCover = book.resources.filter(item => {
    return item.rel.indexOf('cover') !== -1
  })[0]
  if (!propertiesCover) {
    const metaCover = opfDoc.querySelector('meta[name="cover"]')
    const guideCover = opfDoc.querySelector('guide reference[type="cover"]')
    if (metaCover) {
      const cover = book.resources.filter(item => {
        return item.id === metaCover.getAttribute('content')
      })[0]
      if (cover) {
        cover.rel.push('cover')
      }
    } else if (guideCover) {
      const coverHTML = book.resources.filter(item => {
        return (
          item.path ===
          getPath(guideCover.getAttribute('href'), opfPath, global)
        )
      })[0]
      if (coverHTML && coverHTML.mediaType.indexOf('image') !== -1) {
        coverHTML.rel.push('cover')
      }
    }
  }

  // Let's get the reading order
  const itemRefs = Array.from(
    opfDoc.querySelectorAll('itemref:not([linear="no"])')
  )
  book.readingOrder = itemRefs.map(ref => {
    return book.resources.filter(item => {
      return item.id === ref.getAttribute('idref')
    })[0]
  })

  // And the authors. Roles are not yet implemented
  book.author = Array.from(opfDoc.querySelectorAll('creator')).map(
    creator => creator.textContent
  )

  // The id is not needed now and might confuse the API
  book.resources.forEach(item => {
    delete item.id
  })

  return book
}

function getPath (path, opfPath, global) {
  try {
    const opf = new global.URL(opfPath, 'http://example.com/')
    // Return the full pathname, sans initial '/' as that confuses the zip
    return new global.URL(path, opf).pathname.replace('/', '')
  } catch (err) {
    return null
  }
}
