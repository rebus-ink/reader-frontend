import { uploadMedia } from '../uploadMedia.js'
import assert from '../../../js/vendor/nanoassert.js'

const canvas = document.createElement('canvas')
canvas.id = 'import-pdf-cover-page'
canvas.hidden = true
canvas.setAttribute('style', 'display: none;')
document.body.appendChild(canvas)

export async function createPDF (file, context, api, global) {
  assert(file, 'No file found')
  let book = { type: 'Publication', links: [], json: {} }
  const fileArray = await fileToArrayBuffer(file)
  const loadingTask = global.pdfjsLib.getDocument({
    data: fileArray,
    cMapUrl: window.CMAP_URL,
    cMapPacked: window.CMAP_PACKED
  })
  // loadingTask.onProgress = ({ loaded, total }) => {
  //   console.log('progress: ', loaded / total)
  // }
  const pdf = await loadingTask.promise
  const infoData = await pdf.getMetadata()
  const info = infoData.info
  const metadata = infoData.metadata ? infoData.metadata.getAll() : {}
  book.name = metadata['dc:title'] || infoData.info.Title || file.name
  book.author = []
    .concat(metadata['dc:creator'])
    .concat(info.Author)
    .filter(item => item)
  book.json.pdfInfo = info
  book.json.pdfMetadata = metadata
  book.json.totalPages = pdf.numPages
  const canvasContext = canvas.getContext('2d', { alpha: false })
  const page = await pdf.getPage(1)
  const scale = 1.5
  const viewport = page.getViewport(scale)
  canvas.height = viewport.height
  canvas.width = viewport.width
  const renderContext = {
    canvasContext,
    viewport
  }
  await page.render(renderContext).promise
  const coverFile = await canvasToFile(canvas)
  const media = [
    {
      file,
      documentPath: file.name,
      mediaType: file.type,
      json: {}
    },
    {
      file: coverFile,
      documentPath: coverFile.name,
      mediaType: coverFile.type,
      json: {}
    }
  ]
  book.resources = [
    {
      type: 'LinkedResource',
      rel: ['alternate'],
      url: file.name,
      encodingFormat: file.type
    },
    {
      type: 'LinkedResource',
      rel: ['cover'],
      url: coverFile.name,
      encodingFormat: coverFile.type
    }
  ]
  book.readingOrder = [
    {
      type: 'LinkedResource',
      url: file.name,
      encodingFormat: file.type
    }
  ]
  const identifier = await api.activity.createAndGetID(book)
  book.id = identifier
  const uploaded = await uploadMedia({ book, media }, api, global)
  return uploaded
}

function canvasToFile (canvas) {
  assert(canvas, 'No canvas found for PDF cover')
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      blob => {
        const file = new window.File([blob], 'cover.jpeg', {
          type: 'image/jpeg'
        })
        resolve(file)
      },
      'image/jpeg',
      0.75
    )
  })
}

function fileToArrayBuffer (file) {
  return new Promise((resolve, reject) => {
    const reader = new window.FileReader()
    reader.addEventListener('load', event => {
      const buffer = reader.result
      resolve(buffer)
    })
    reader.addEventListener('error', event => {
      reject(new Error(`Failed to read ${file.name} as ArrayBuffer`))
    })
    reader.readAsArrayBuffer(file)
  })
}
