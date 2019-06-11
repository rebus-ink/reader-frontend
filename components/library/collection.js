import { html } from 'lit-html'
import { component, useContext, useState, useEffect } from 'haunted'
import { ApiContext } from '../api-provider.component.js'
import { createAPI } from '../api.state.js'
import { classMap } from 'lit-html/directives/class-map.js'
import { close } from '../hooks/useModal.js'
import '/js/vendor/file-drop-element.js'
import '../widgets/button.js'
import '../modals/menumodal.js'
import './book-list.js'

export const title = 'Uploader: `<ink-uploader>`'

export const description = `The upload section of the recents view`

// http://localhost:8080/demo/?component=/components/library/uploader.js
export const preview = () => {
  const api = createAPI()
  api.formats = {}
  api.formats.pdf = api.formats.epub = file => {
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve({ type: 'Publication', name: file.name }), 3000)
    })
  }
  api.library = () => {}
  return html`<api-provider .value=${api}>
    <ink-uploader></ink-uploader>
    <ink-uploader-modal id="uploading-files-1"></ink-uploader-modal>
  </api-provider>
`
}
let setModalRef
export const InkCollection = () => {
  const api = useContext(ApiContext)
  const [files, setQueue] = useState(api.uploads.files)
  useEffect(() => {
    api.events.on('imported', () => setQueue(api.uploads.files))
    api.events.on('importing', () => setQueue(api.uploads.files))
    api.events.on('queue-empty', () => setQueue(api.uploads.files))
  }, [])
  return html`<style>
  </style><div class=${classMap({
    'header-row': true,
    uploading: files.size !== 0
  })}></div>`
}

window.customElements.define(
  'ink-uploader',
  component(InkCollection, window.HTMLElement)
)
window.customElements.define(
  'ink-uploader-modal',
  component(UploadModal, window.HTMLElement, { useShadowDOM: false })
)
