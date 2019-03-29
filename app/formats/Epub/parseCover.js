import {getPath} from './utils.js'
import {getGlobals, getParser} from '../context.js'

export async function parseCover (props) {
  const context = getGlobals()
  const parser = getParser()
  const propertiesCover = props.attachment.filter(item => {
    return item.properties.indexOf('cover-image') !== -1
  })[0]
  const metaCover = props.opfDoc.querySelector('meta[name="cover"]')
  const guideCover = props.opfDoc.querySelector('guide reference[type="cover"]')
  const linearCover = props.opfDoc.querySelector('itemref')
  let cover
  if (propertiesCover) {
    cover = propertiesCover
  } else if (metaCover) {
    cover = props.attachment.filter(item => {
      return item.id === metaCover.getAttribute('content')
    })[0]
  } else if (guideCover) {
    const coverHTML = props.attachment.filter(item => {
      return item.path === getPath(guideCover.getAttribute('href'), props)
    })[0]
    if (coverHTML && coverHTML.mediaType.indexOf('image') !== -1) {
      cover = coverHTML
    } else if (coverHTML && coverHTML.path) {
      const file = await props.zip
        .file(decodeURI(coverHTML.path))
        .async('string')
      const fileDoc = parser.parseFromString(file, 'text/html')
      const imageEl = fileDoc.querySelector('img')
      if (imageEl) {
        const src = imageEl.getAttribute('src')
        const url = new context.URL(src, coverHTML.href).href
        cover = props.attachment.filter(item => {
          return item.href.href === url
        })[0]
      }
    }
  } else if (linearCover) {
    const item = props.attachment.filter(item => {
      return item.id === linearCover.getAttribute('idref')
    })[0]
    if (item && item.path) {
      const file = await props.zip.file(decodeURI(item.path)).async('string')
      const fileDoc = parser.parseFromString(file, 'text/html')
      const imageEl = fileDoc.querySelector('img')
      if (imageEl) {
        const src = imageEl.getAttribute('src')
        const url = new context.URL(src, item.href).href
        cover = props.attachment.filter(item => {
          return item.href.href === url
        })[0]
      }
    }
  }
  if (cover) {
    props.cover = props.icon = cover
  }
  return props
}
