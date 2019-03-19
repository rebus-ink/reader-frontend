import {getGlobals} from '../context.js'

export async function formData (props, upload) {
  const context = getGlobals()
  const zip = props.zip
  // Another future feature is getting media sizes as they are being uploaded
  // There are security implications for hosting unmodified html, css, and js files on a domain we control. So, we're only going to upload images and media. The long term solution is to sanitize the svg
  // To upload, blobs need to be turned into File objects and added to a FormData object which becomes the payload.
  // First upload the epub.
  try {
    const data = new context.FormData()
    const filename = props.fileName
    const file = new context.File([props.file], filename, {
      type: 'application/epub+zip'
    })
    data.append('files', file)
    const result = await upload(data)
    props.url[0].href = result[filename]
  } catch (err) {
    err.httpMethod = 'Parser'
    throw err
  }
  // Then cycle through the attachments and upload images, audio, video
  const paths = {}
  const uploads = []
  let data
  for (var index = 0; index < props.attachment.length; index++) {
    if (!data) {
      data = new context.FormData()
    }
    const resource = props.attachment[index]
    const blob = await zip.file(decodeURI(resource.path)).async('blob')
    const extension = decodeURI(resource.path).split('.').pop()
    const filename = `${index}.${extension}`
    paths[filename] = resource
    const file = new context.File([blob], filename, { type: resource.mediaType })
    data.append('files', file)
    if ((index + 1) % 10 === 0) {
      uploads.push(upload(data))
      data = null
    }
  }
  if (data) {
    uploads.push(upload(data))
  }
  try {
    const results = await Promise.all(uploads)
    results.forEach(result => {
      Object.keys(result).forEach(prop => {
        if (paths[prop]) {
          const resource = paths[prop]
          resource.activity.url[0].href = result[prop]
        }
        if (paths[prop].activity['reader:path'] === props.opfPath) {
          props.url[1].href = result[prop]
        }
      })
    })
  } catch (err) {
    err.httpMethod = 'Parser'
    throw err
  }
  if (
    props.cover &&
    props.cover.activity &&
    props.cover.activity.url &&
    props.cover.activity.url[0]
  ) {
    props.icon = {
      type: 'Image',
      summary: 'EPUB Cover',
      url: props.cover.activity.url[0].href,
      mediaType: props.cover.mediaType
    }
  }
  return props
}
