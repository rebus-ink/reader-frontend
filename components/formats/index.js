import { createEpub } from './epub/index.js'
import { createPDF } from './pdf/index.js'

/* istanbul ignore next */
async function zipModule () {
  if (window.JSZip) return window.JSZip
  const zip = await import(window.ZIPJSPATH || '/js/vendor/zip.js')
  return zip
}

/* istanbul ignore next */
async function pdfModule () {
  if (window.pdfjsLib) return window.pdfjsLib
  await import(window.PDFJSPATH || '/js/pdfjs-dist/build/pdf.min.js')
  window.pdfjsLib.GlobalWorkerOptions.workerSrc =
    '/js/pdfjs-dist/build/pdf.worker.js'
  window.CMAP_URL = '/js/pdfjs-dist/cmaps/'
  window.CMAP_PACKED = true
  return window.pdfjsLib
}

export function createFormatsAPI (context, api, global) {
  return {
    get epub () {
      console.log('in formats.epub')
      return async file => {
        await zipModule()
        return createEpub(file, context, api, global)
      }
    },
    get pdf () {
      return async file => {
        await pdfModule()
        return createPDF(file, context, api, global)
      }
    }
  }
}
