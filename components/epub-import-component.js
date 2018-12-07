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
      const progress = this.querySelector('[data-upload-progress')
      progress.textContent = `Loading ${file.name}`
      try {
        const context = await actions.load({}, {detail: { file }})
        progress.textContent = `Parsing ${context.title}`
        const parsed = await actions.parse(context)
        progress.textContent = `Processing ${context.title}`
        const processed = await actions.process(parsed)
        progress.textContent = `Uploading media from ${context.title}`
        const uploaded = await actions.upload(processed)
        progress.textContent = `Creating ${context.title}`
        const created = await actions.create(uploaded)
        progress.textContent = ''
        console.log(created)
        const log = this.querySelector('[data-upload-log]')
        const report = document.createElement('li')
        report.textContent = `Uploaded ${context.title} to library`
        log.appendChild(report)
      } catch (err) {
        console.log(err)
      }
    }
  },
  { extends: 'form' }
)
