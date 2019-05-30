import { uploadMedia } from '../uploadMedia.js'

export async function createPDF (file, context, api, global) {
  let book = { type: 'Publication', links: [], json: {} }
  const fileArray = await fileToArrayBuffer(file)
  const pdf = await window.pdfjsLib.getDocument({
    data: fileArray,
    cMapUrl: window.CMAP_URL,
    cMapPacked: window.CMAP_PACKED
  }).promise
  const infoData = await pdf.getMetadata()
  const info = infoData.info
  const metadata = infoData.metadata ? infoData.metadata.getAll() : {}
  book.name = metadata['dc:title'] || infoData.info.Title || file.name
  book.author = [].concat(metadata['dc:creator']).concat(info.Author)
  book.json.pdfInfo = info
  book.json.pdfMetadata = metadata
  book.json.totalPages = pdf.numPages
  const canvas = document.createElement('canvas')
  canvas.setAttribute('style', 'display: none;')
  document.body.appendChild(canvas)
  const canvasContext = canvas.getContext('2d')
  const page = await pdf.getPage(1)
  const scale = 2.0
  const viewport = page.getViewport({ scale: scale })
  canvas.height = viewport.height
  canvas.width = viewport.width
  const renderContext = {
    canvasContext,
    viewport
  }
  page.render(renderContext)
  const coverFile = await canvasToFile(canvas)
  document.body.removeChild(canvas)
  const media = [
    {
      file,
      documentPath: file.name,
      mediaType: file.type,
      json: {}
    },
    {
      coverFile,
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
