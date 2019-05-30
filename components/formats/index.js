import { createEpub } from './epub/index.js'
import { createPDF } from './pdf/index.js'

/* istanbul ignore next */
let zip
async function zipModule () {
  if (zip) return zip
  zip = await import('/js/vendor/zip.js')
  return zip
}
/* istanbul ignore next */
async function pdfModule () {
  if (window.pdfjsLib) return window.pdfjsLib
  window.pdfjsLib = await import('/js/pdfjs-dist/build/pdf.min.js')
  window.pdfjsLib.GlobalWorkerOptions.workerSrc =
    '/js/pdfjs-dist/build/pdf.worker.js'
  window.CMAP_URL = '/js/pdfjs-dist/cmaps/'
  window.CMAP_PACKED = true
  return window.pdfjsLib
}

export function createFormatsAPI (context, api, global) {
  return {
    get epub () {
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
