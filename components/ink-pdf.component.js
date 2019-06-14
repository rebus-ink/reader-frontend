import { html, render } from 'lit-html'
import wickedElements from 'wicked-elements'

export const title = 'Ink PDF display: `<ink-pdf>`'

export const preview = () => {
  return html`<ink-pdf is="ink-pdf" chapter="/test/test-files/this-is-a-test-pdf.pdf">
<div><div id="viewer" class="pdfViewer">
  </div></div>
</ink-pdf>`
}

wickedElements.define('ink-pdf', {
  init: function (event) {
    window.CMAP_URL = '/js/pdfjs-dist/cmaps/'
    window.CMAP_PACKED = true
    this.element = event.currentTarget
  },
  onconnected (event) {
    this.render()
    console.log(this.element.children[0])
    window.pdfjsLib.GlobalWorkerOptions.workerSrc =
      '/js/pdfjs-dist/build/pdf.worker.min.js'
    this.pdfLinkService = new window.pdfjsViewer.PDFLinkService()
    this.pdfViewer = new window.pdfjsViewer.PDFViewer({
      container: this.element.children[0],
      linkService: this.pdfLinkService,
      renderer: 'svg',
      textLayerMode: 0
    })
    this.pdfLinkService.setViewer(this.pdfViewer)
    document.addEventListener('pagesinit', () => {
      this.pdfViewer.currentScaleValue = 'page-width'
    })
    if (this.element.getAttribute('chapter')) { this.chapter(this.element.getAttribute('chapter')) }
  },
  render () {
    render(
      html`<div><div id="viewer" class="pdfViewer">
    </div></div>`,
      this.element
    )
  },
  chapter (chapter) {
    const loadingTask = window.pdfjsLib.getDocument({
      url: chapter,
      cMapUrl: window.CMAP_URL,
      cMapPacked: window.CMAP_PACKED
    })
    loadingTask.promise.then(pdfDocument => {
      console.log(pdfDocument)
      // Document loaded, specifying document for the viewer and
      // the (optional) linkService.
      this.pdfViewer.setDocument(pdfDocument)
      this.pdfLinkService.setDocument(pdfDocument, null)
    })
  },
  ondisconnected (event) {},
  observedAttributes: ['chapter', 'location'],
  onattributechanged (event) {
    console.log(event)
    const { attributeName, newValue } = event
    if (attributeName === 'chapter' && newValue) {
      this.chapter(newValue)
    }
  }
})
