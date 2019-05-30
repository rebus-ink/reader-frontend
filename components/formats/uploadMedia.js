import queue from 'async-es/queue'

export async function uploadMedia (created, api, global) {
  const { book, media } = await created
  const uploadQueue = queue(uploadData(created, api, global), 3)
  for (const item of media) {
    uploadQueue.push(item)
  }
  for (const item of book.resources) {
    uploadQueue.push({
      documentPath: item.url,
      mediaType: item.encodingFormat,
      json: {}
    })
  }
  await uploadQueue.drain()
  return book
}

function uploadData (created, api, global) {
  const { zip, book } = created
  return async function uploader (item) {
    try {
      const data = new global.FormData()
      const filename = decodeURI(item.url)
        .split('/')
        .pop()
      let file
      if (item.file) {
        file = item.file
      } else {
        const blob = await zip.file(decodeURI(item.url)).async('blob')
        file = new global.File([blob], filename, { type: item.mediaType })
      }
      data.append('file', file)
      data.append('documentPath', item.documentPath)
      data.append('mediaType', item.mediaType)
      data.append('json', JSON.stringify(item.json))
      return api.activity.upload(data, `${book.id}/file-upload`)
    } catch (err) {
      err.httpMethod = 'Parser'
      throw err
    }
  }
}
