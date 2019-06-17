import { html } from 'lit-html'
import { component, useContext, useState, useEffect } from 'haunted'
import { ApiContext } from '../api-provider.component.js'
import { createAPI } from '../api.state.js'
import { classMap } from 'lit-html/directives/class-map.js'
import { close } from '../hooks/useModal.js'
import '../../js/vendor/file-drop-element.js'
import '../widgets/button.js'
import '../modals/menumodal.js'

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
export const InkUploader = () => {
  const api = useContext(ApiContext)
  const [files, setQueue] = useState(api.uploads.files)
  useEffect(() => {
    api.events.on('imported', () => setQueue(api.uploads.files))
    api.events.on('importing', () => setQueue(api.uploads.files))
    api.events.on('queue-empty', () => setQueue(api.uploads.files))
  }, [])
  return html`<style>
  file-drop {
    display: block;
    flex: 1 1 100%;
    border-radius: 0.25rem;
    display: flex;
    flex-direction: column;
    border: 2px dotted var(--rc-dark);
    background-color: var(--rc-lighter);
    margin: 0.25rem 0;
    padding: 1rem;
  }
  @keyframes outlinePop {
    0% {
      box-shadow: 0 0 0 1px rgba(33, 33, 33, 0);
    }
    50% {
      box-shadow: 0 0 0 8px #2ed0ac;
    }
    100% {
      box-shadow: 0 0 0 3px #2ed0ac;
    }
  }
  @keyframes outlinePopInvalid {
    0% {
      box-shadow: 0 0 0 1px rgba(33, 33, 33, 0);
    }
    50% {
      box-shadow: 0 0 0 8px #ff3b3b;
    }
    100% {
      box-shadow: 0 0 0 3px #ff3b3b;
    }
  }
  .drop-valid {
    border: 2px solid #2ed0ac;
    background-color: #F1FFFD;
    animation: outlinePop 0.25s ease-in-out;
  }
  .drop-invalid {
    animation: outlinePopInvalid 0.25s ease-in-out;
    border: 2px solid #ff3b3b;
    background-color: #FDF6F5;
  }
  file-drop p {
    margin: 0.25rem;
    padding: 0;
    text-align: center;
    font-size: 0.75rem;
    line-height: 1;
    color: var(--rc-darker);
  }
  .input {
    text-indent: 3rem;
  }
  .header-row {
    display: flex;
    justify-content: space-between;
    min-height: 30px;
  }
  .header-row p {
    font-size: 0.7rem;
    text-transform: uppercase;
    color: var(--medium);
    margin: 0;
    margin-top: 0.25rem;
  }
@keyframes buttonPop {
  0% {
    transform: scale(0.8);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}
ink-button {
  display: none;
}
  .uploading ink-button {
    display: block;
    animation: buttonPop 0.25s ease-in-out;
  }
  </style><div class=${classMap({
    'header-row': true,
    uploading: files.size !== 0
  })}><p>Upload file</p>
  <ink-button @click=${event => {
    if (setModalRef) {
      setModalRef(event.target)
    }
  }} dropdown secondary compact>Uploading ${
  files.size
}</ink-button></div><file-drop accept=".epub,.pdf,application/epub+zip,application/pdf" multiple @filedrop=${event =>
  fileDrop(event.files, api)}>
  <p>Drop file here</p>
  <p>or</p>
  <p class="input">
    <input type="file" name="file-selector" id="file-selector" accept=".epub,.pdf,application/epub+zip,application/pdf" multiple @change=${event =>
    fileDrop(event.target.files, api)}>
  </p>
</file-drop>`
}

export const UploadModal = () => {
  const api = useContext(ApiContext)
  const [files, setQueue] = useState(api.uploads.files)
  const [ref, setRef] = useState(false)
  setModalRef = setRef
  useEffect(() => {
    api.events.on('imported', () => setQueue(api.uploads.files))
    api.events.on('importing', () => setQueue(api.uploads.files))
    api.events.on('queue-empty', () => setQueue(api.uploads.files))
  }, [])
  useEffect(() => {
    if (files.size === 0) {
      close()
    }
  })
  return html`<ink-menu-modal .open=${ref}><strong slot="modal-title">${
    files.size
  } Items</strong><ol slot="modal-body">${Array.from(files).map(
    file => html`<li class="MenuItem">${file.name}</li>`
  )}</ol></ink-menu-modal>`
}

window.customElements.define(
  'ink-uploader',
  component(InkUploader, window.HTMLElement)
)
window.customElements.define(
  'ink-uploader-modal',
  component(UploadModal, window.HTMLElement, { useShadowDOM: false })
)

function fileDrop (files, api) {
  for (let file of files) {
    api.uploads.add(file)
  }
}
