import { createEpub } from './epub/index.js'
import { createPDF } from './pdf/index.js'

/* istanbul ignore next */
async function zipModule () {
  if (window.JSZip) return window.JSZip
  return import(window.ZIPJSPATH || '/js/vendor/zip.js')
}

/* istanbul ignore next */
function pdfModule () {
  if (window.pdfjsLib) return Promise.resolve(window.pdfjsLib)
  return new Promise(resolve => {
    const pdfScript = document.createElement('script')
    pdfScript.async = false
    pdfScript.src = '/js/pdfjs-dist/build/pdf.min.js'
    document.head.appendChild(pdfScript)
    function listener (loaded) {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc =
        '/js/pdfjs-dist/build/pdf.worker.js'
      window.CMAP_URL = '/js/pdfjs-dist/cmaps/'
      window.CMAP_PACKED = true
      resolve(true)
      pdfScript.removeEventListener('loaded', listener)
    }
    pdfScript.addEventListener('loaded', listener)
  })
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
