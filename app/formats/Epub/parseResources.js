import {getPath} from './utils.js'
export async function parseResources (props) {
  props.attachment = Array.from(props.opfDoc.querySelectorAll('item'))
    .map(item => {
      const path = getPath(item.getAttribute('href'), props)
      const href = new URL(path, props.DOMAIN)
      const id = item.getAttribute('id')
      const properties = item.getAttribute('properties') || ''
      return {
        path,
        href,
        id,
        properties,
        mediaType: item.getAttribute('media-type')
      }
    })
    .map(itemToActivityStub)
  props.attachment.push(itemToActivityStub({
    path: props.opfPath,
    href: new URL(props.opfPath, props.DOMAIN),
    mediaType: 'application/oebps-package+xml',
    properties: ''
  }))
  return props
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
  if (item.properties && item.properties.indexOf('cover-image') !== -1) {
    item.activity.rel = ['cover']
  } else if (item.properties && item.properties.indexOf('nav') !== -1) {
    item.activity.rel = ['contents']
  }
  item.activity.mediaType = item.mediaType
  item.activity.url = [
    {
      type: 'Link',
      href: item.href,
      rel: ['alternate'],
      mediaType: item.mediaType
    }
  ]
  item.summary = `Resource of type ${item.mediaType}`
  item.activity['reader:path'] = item.path
  return item
}
