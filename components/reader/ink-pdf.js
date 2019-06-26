import { html, render } from 'lit-html'
import { component } from 'haunted'

window.CMAP_URL = '/js/pdfjs-dist/cmaps/'
window.CMAP_PACKED = true

export const title = 'Ink PDF display: `<ink-pdf>`'

export const preview = () => {
  return html`<ink-pdf is="ink-pdf" chapter="/test/test-files/this-is-a-test-pdf.pdf">
<div><div id="viewer" class="pdfViewer">
  </div></div>
</ink-pdf>`
}

export const InkPDF = el => {
  const { location, chapter, scale = 'auto' } = el
  // 'page-width' 'page-actual' 'page-fit' 'page-height'  'auto'
  return html`
    <style>
    :host {
      display: block;
      height: 100vh;
    }
    /* 
    Below styles are from the PDF.js project
 */

.textLayer {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  opacity: 0.2;
  line-height: 1.0;
}

.textLayer > div {
  color: transparent;
  position: absolute;
  white-space: pre;
  cursor: text;
  -webkit-transform-origin: 0% 0%;
          transform-origin: 0% 0%;
}

.textLayer .highlight {
  margin: -1px;
  padding: 1px;

  background-color: rgb(180, 0, 170);
  border-radius: 4px;
}

.textLayer .highlight.begin {
  border-radius: 4px 0px 0px 4px;
}

.textLayer .highlight.end {
  border-radius: 0px 4px 4px 0px;
}

.textLayer .highlight.middle {
  border-radius: 0px;
}

.textLayer .highlight.selected {
  background-color: rgb(0, 100, 0);
}

.textLayer ::-moz-selection { background: rgb(0,0,255); }

.textLayer ::selection { background: rgb(0,0,255); }

.textLayer .endOfContent {
  display: block;
  position: absolute;
  left: 0px;
  top: 100%;
  right: 0px;
  bottom: 0px;
  z-index: -1;
  cursor: default;
  -webkit-user-select: none;
     -moz-user-select: none;
      -ms-user-select: none;
          user-select: none;
}

.textLayer .endOfContent.active {
  top: 0px;
}


.annotationLayer section {
  position: absolute;
}

.annotationLayer .linkAnnotation > a,
.annotationLayer .buttonWidgetAnnotation.pushButton > a {
  position: absolute;
  font-size: 1em;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.annotationLayer .linkAnnotation > a:hover,
.annotationLayer .buttonWidgetAnnotation.pushButton > a:hover {
  opacity: 0.2;
  background: #ff0;
  box-shadow: 0px 2px 10px #ff0;
}

.annotationLayer .textAnnotation img {
  position: absolute;
  cursor: pointer;
}

.annotationLayer .textWidgetAnnotation input,
.annotationLayer .textWidgetAnnotation textarea,
.annotationLayer .choiceWidgetAnnotation select,
.annotationLayer .buttonWidgetAnnotation.checkBox input,
.annotationLayer .buttonWidgetAnnotation.radioButton input {
  background-color: rgba(0, 54, 255, 0.13);
  border: 1px solid transparent;
  box-sizing: border-box;
  font-size: 9px;
  height: 100%;
  margin: 0;
  padding: 0 3px;
  vertical-align: top;
  width: 100%;
}

.annotationLayer .choiceWidgetAnnotation select option {
  padding: 0;
}

.annotationLayer .buttonWidgetAnnotation.radioButton input {
  border-radius: 50%;
}

.annotationLayer .textWidgetAnnotation textarea {
  font: message-box;
  font-size: 9px;
  resize: none;
}

.annotationLayer .textWidgetAnnotation input[disabled],
.annotationLayer .textWidgetAnnotation textarea[disabled],
.annotationLayer .choiceWidgetAnnotation select[disabled],
.annotationLayer .buttonWidgetAnnotation.checkBox input[disabled],
.annotationLayer .buttonWidgetAnnotation.radioButton input[disabled] {
  background: none;
  border: 1px solid transparent;
  cursor: not-allowed;
}

.annotationLayer .textWidgetAnnotation input:hover,
.annotationLayer .textWidgetAnnotation textarea:hover,
.annotationLayer .choiceWidgetAnnotation select:hover,
.annotationLayer .buttonWidgetAnnotation.checkBox input:hover,
.annotationLayer .buttonWidgetAnnotation.radioButton input:hover {
  border: 1px solid #000;
}

.annotationLayer .textWidgetAnnotation input:focus,
.annotationLayer .textWidgetAnnotation textarea:focus,
.annotationLayer .choiceWidgetAnnotation select:focus {
  background: none;
  border: 1px solid transparent;
}

.annotationLayer .buttonWidgetAnnotation.checkBox input:checked:before,
.annotationLayer .buttonWidgetAnnotation.checkBox input:checked:after,
.annotationLayer .buttonWidgetAnnotation.radioButton input:checked:before {
  background-color: #000;
  content: '';
  display: block;
  position: absolute;
}

.annotationLayer .buttonWidgetAnnotation.checkBox input:checked:before,
.annotationLayer .buttonWidgetAnnotation.checkBox input:checked:after {
  height: 80%;
  left: 45%;
  width: 1px;
}

.annotationLayer .buttonWidgetAnnotation.checkBox input:checked:before {
  -webkit-transform: rotate(45deg);
          transform: rotate(45deg);
}

.annotationLayer .buttonWidgetAnnotation.checkBox input:checked:after {
  -webkit-transform: rotate(-45deg);
          transform: rotate(-45deg);
}

.annotationLayer .buttonWidgetAnnotation.radioButton input:checked:before {
  border-radius: 50%;
  height: 50%;
  left: 30%;
  top: 20%;
  width: 50%;
}

.annotationLayer .textWidgetAnnotation input.comb {
  font-family: monospace;
  padding-left: 2px;
  padding-right: 0;
}

.annotationLayer .textWidgetAnnotation input.comb:focus {
  /*
   * Letter spacing is placed on the right side of each character. Hence, the
   * letter spacing of the last character may be placed outside the visible
   * area, causing horizontal scrolling. We avoid this by extending the width
   * when the element has focus and revert this when it loses focus.
   */
  width: 115%;
}

.annotationLayer .buttonWidgetAnnotation.checkBox input,
.annotationLayer .buttonWidgetAnnotation.radioButton input {
  -webkit-appearance: none;
     -moz-appearance: none;
          appearance: none;
  padding: 0;
}

.annotationLayer .popupWrapper {
  position: absolute;
  width: 20em;
}

.annotationLayer .popup {
  position: absolute;
  z-index: 200;
  max-width: 20em;
  background-color: #FFFF99;
  box-shadow: 0px 2px 5px #333;
  border-radius: 2px;
  padding: 0.6em;
  margin-left: 5px;
  cursor: pointer;
  font: message-box;
  word-wrap: break-word;
}

.annotationLayer .popup h1 {
  font-size: 1em;
  border-bottom: 1px solid #000000;
  margin: 0;
  padding-bottom: 0.2em;
}

.annotationLayer .popup p {
  margin: 0;
  padding-top: 0.2em;
}

.annotationLayer .highlightAnnotation,
.annotationLayer .underlineAnnotation,
.annotationLayer .squigglyAnnotation,
.annotationLayer .strikeoutAnnotation,
.annotationLayer .lineAnnotation svg line,
.annotationLayer .squareAnnotation svg rect,
.annotationLayer .circleAnnotation svg ellipse,
.annotationLayer .polylineAnnotation svg polyline,
.annotationLayer .polygonAnnotation svg polygon,
.annotationLayer .inkAnnotation svg polyline,
.annotationLayer .stampAnnotation,
.annotationLayer .fileAttachmentAnnotation {
  cursor: pointer;
}

.pdfViewer .canvasWrapper {
  overflow: hidden;
}

.pdfViewer .page {
  direction: ltr;
  width: 816px;
  height: 1056px;
  margin: 1px auto -8px auto;
  position: relative;
  overflow: visible;
  background-clip: content-box;
  background-color: white;
}

.pdfViewer.removePageBorders .page {
  margin: 0px auto 10px auto;
  border: none;
  box-shadow: 1px 1px 4px #32a5a522, inset 0 0 0 1px #eee;
}

.pdfViewer.singlePageView {
  display: inline-block;
}

.pdfViewer.singlePageView .page {
  margin: 0;
  border: none;
}

.pdfViewer.scrollHorizontal, .pdfViewer.scrollWrapped, .spread {
  margin-left: 3.5px;
  margin-right: 3.5px;
  text-align: center;
}

.pdfViewer.scrollHorizontal, .spread {
  white-space: nowrap;
}

.pdfViewer.removePageBorders,
.pdfViewer.scrollHorizontal .spread,
.pdfViewer.scrollWrapped .spread {
  margin-left: 0;
  margin-right: 0;
}

.spread .page,
.pdfViewer.scrollHorizontal .page,
.pdfViewer.scrollWrapped .page,
.pdfViewer.scrollHorizontal .spread,
.pdfViewer.scrollWrapped .spread {
  display: inline-block;
  vertical-align: middle;
}

.spread .page,
.pdfViewer.scrollHorizontal .page,
.pdfViewer.scrollWrapped .page {
  margin-left: -3.5px;
  margin-right: -3.5px;
}

.pdfViewer.removePageBorders .spread .page,
.pdfViewer.removePageBorders.scrollHorizontal .page,
.pdfViewer.removePageBorders.scrollWrapped .page {
  margin-left: 5px;
  margin-right: 5px;
}

.pdfViewer .page canvas {
  margin: 0;
  display: block;
}

.pdfViewer .page canvas[hidden] {
  display: none;
}

.pdfViewer .page .loadingIcon {
  position: absolute;
  display: block;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background: url('/js/pdfjs-dist/web/images/loading-icon.gif') center no-repeat;
}
ink-pdf-render[scale="page-height"] > div {
  height: 100vh;
  overflow: auto;
}

</style>
    <ink-pdf-render scale=${scale} chapter=${chapter} location=${location}></ink-pdf-render>`
}
InkPDF.observedAttributes = ['chapter', 'location', 'scale']

window.customElements.define(
  'ink-pdf',
  component(InkPDF, window.HTMLElement, { useShadowDOM: false })
)

class InkPDFRender extends window.HTMLElement {
  connectedCallback () {
    this.render()
    console.log(this.children[0])
    window.pdfjsLib.GlobalWorkerOptions.workerSrc =
      '/js/pdfjs-dist/build/pdf.worker.min.js'
    this.pdfLinkService = new window.pdfjsViewer.PDFLinkService()
    this.pdfViewer = new window.pdfjsViewer.PDFViewer({
      container: this.children[0],
      linkService: this.pdfLinkService,
      renderer: 'svg',
      textLayerMode: 1,
      removePageBorders: true
    })
    this.pdfLinkService.setViewer(this.pdfViewer)
    this.addEventListener('pagesinit', ev => {
      console.log(ev)
      this.pdfViewer.currentScaleValue = this.getAttribute('scale')
    })
    this.addEventListener('pagesloaded', ev => {
      this.goToPage(this.getAttribute('location'))
      setupObservers(this)
      console.log(ev)
    })
    // if (this.getAttribute('chapter')) { this.chapter(this.getAttribute('chapter')) }
  }
  goToPage (location) {
    window.requestAnimationFrame(() => {
      if (location) {
        const page = location.replace('page', '')
        const element = this.querySelector(`[data-page-number="${page}"]`)
        if (element) {
          element.scrollIntoView({ behaviour: 'smooth' })
        }
      }
    })
  }
  render () {
    render(
      html`<div><div id="viewer" class="pdfViewer">
    </div></div>`,
      this
    )
  }
  chapter (chapter) {
    console.log(chapter)
    if (chapter) {
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
    }
  }
  attributeChangedCallback (name, oldValue, newValue) {
    if (name === 'chapter') {
      this.chapter(newValue)
    } else if (name === 'scale') {
      this.chapter(this.getAttribute('chapter'))
    } else if (name === 'location') {
      this.goToPage(newValue)
    }
  }
  static get observedAttributes () {
    return ['chapter', 'location', 'scale']
  }
}
window.customElements.define('ink-pdf-render', InkPDFRender, {
  shadowRootInit: { delegatesFocus: true }
})

const positionObserver = new window.IntersectionObserver(onPosition, {
  rootMargin: '0px 0px 0px 0px'
})

let highest
let visible = []
function onPosition (entries) {
  const enteringView = entries
    .filter(entry => entry.isIntersecting)
    .map(entry => entry.target)
  const leavingView = entries
    .filter(entry => !entry.isIntersecting)
    .map(entry => entry.target)
  visible = visible.filter(entry => !leavingView.includes(entry))
  visible = visible.concat(enteringView)
  if (visible[1]) {
    highest = visible[1]
  } else {
    highest = visible[0]
  }
  let root
  if (highest) {
    root = highest.closest('ink-pdf')
    root
      .querySelectorAll('.is-current')
      .forEach(element => element.classList.remove('is-current'))
    highest.classList.add('is-current')
    root.setAttribute('current', highest.id)
  }
}

function setupObservers (root) {
  const pages = Array.from(root.querySelectorAll('[data-page-number]'))
  pages.forEach(page => {
    page.id = 'page' + page.dataset.pageNumber
    positionObserver.observe(page)
  })
}
