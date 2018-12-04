const actions = window.actions

window.customElements.define(
  'epub-import',
  class EpubImportForm extends window.HTMLFormElement {
    connectedCallback () {
      this.addEventListener('change', this)
      this.fileInput = this.querySelector('input[type="file"]')
    }
    disconnectedCallback () {
      this.removeEventListener('change', this)
    }
    async handleEvent (event) {
      const file = this.fileInput.files[0]
      const context = await actions.load({}, {detail: { file }})
      this.querySelector('[data-upload-progress').textContent = `Uploading ${file.name}`
      const parsed = await actions.parse(context)
      const processed = await actions.process(parsed)
      const uploaded = await actions.upload(processed)
      const created = await actions.create(uploaded)
      console.log(created)
      const log = this.querySelector('[data-upload-log]')
      const report = document.createElement('li')
      report.textContent = `Uploaded ${context.title}`
      log.appendChild(report)
    }
  },
  { extends: 'form' }
)
