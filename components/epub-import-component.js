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
      const progress = this.querySelector('[data-upload-progress]')
      console.log(file.name)
      progress.textContent = `Loading ${file.name}`
      const log = this.querySelector('[data-upload-log]')
      try {
        const context = await actions.load({}, { detail: { file } })
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
        const report = document.createElement('li')
        report.innerHTML = `${
          context.title
        } has been added to your library <span class="Import-checkmark">✔️</span>`
        log.appendChild(report)
      } catch (err) {
        console.log(err)
        const report = document.createElement('li')
        report.innerHTML = `<pre><code>${err.stack}</pre></code>`
        log.appendChild(report)
      }
    }
  },
  { extends: 'form' }
)
