import queue from 'async-es/queue'
import assert from '../../js/vendor/nanoassert.js'

export async function uploadMedia (created, api, global) {
  const { book, media } = await created
  assert(book, 'No publication found to upload')
  assert(media, 'No media found to upload')
  const uploadQueue = queue(uploadData(created, api, global), 1)
  for (const item of media) {
    uploadQueue.push(item)
  }
  const mediaPaths = media.map(item => item.documentPath)
  for (const item of book.resources) {
    if (!mediaPaths.includes(item.url)) {
      console.log(item)
      uploadQueue.push({
        documentPath: item.url,
        mediaType: item.encodingFormat,
        json: {}
      })
    }
  }
  await uploadQueue.drain()
  return book
}

function uploadData (created, api, global) {
  const { zip, book } = created
  return async function uploader (item) {
    if (
      item.mediaType.includes('javascript') ||
      item.mediaType.includes('jscript') ||
      item.mediaType.includes('ecmascript')
    ) {
      return
    }
    try {
      const data = new global.FormData()
      const filename = decodeURI(item.url)
        .split('/')
        .pop()
      let file
      if (item.file) {
        file = item.file
      } else {
        const blob = await zip.file(decodeURI(item.documentPath)).async('blob')
        file = new global.File([blob], filename, { type: item.mediaType })
      }
      data.append('file', file)
      data.append('documentPath', item.documentPath)
      data.append('mediaType', item.mediaType)
      data.append('json', JSON.stringify(item.json))
      return api.activity.upload(data, `${book.id}/file-upload`)
    } catch (err) {
      console.error(err)
      err.httpMethod = 'Parser'
      throw err
    }
  }
}
