import { html } from 'lit-html'
import { component, useState, useEffect } from 'haunted'
import DOMPurify from 'dompurify'

let params = new URLSearchParams(window.location.search.substring(1))
const mod = params.get('component')
const converter = new window.showdown.Converter()

function md (text) {
  console.log(converter)
  const html = converter.makeHtml(text)
  return DOMPurify.sanitize(html, purifyConfig)
}

const purifyConfig = {
  KEEP_CONTENT: false,
  RETURN_DOM: true,
  RETURN_DOM_FRAGMENT: true,
  RETURN_DOM_IMPORT: true
}

async function renderPreview (mod, setModule) {
  console.log(mod)
  if (mod) {
    const comp = await import(mod)
    setModule(comp)
  }
}

export const PreviewComponent = component(
  ({ value }) => {
    console.log(value)
    return html`${value()}`
  },
  window.HTMLElement,
  { useShadowDOM: false }
)

export const PreviewDescription = component(
  ({ value }) => {
    console.log(value)
    return html`<p>${md(value)}</p>`
  },
  window.HTMLElement,
  { useShadowDOM: false }
)

export const PreviewTitle = component(
  ({ value }) => {
    return html`${md('# ' + value)}`
  },
  window.HTMLElement,
  { useShadowDOM: false }
)

export const PreviewApp = component(() => {
  const [comp, setModule] = useState({preview: () => {}, description: '', title: ''})
  console.log(comp.title)
  useEffect(() => {
    return renderPreview(mod, setModule)
  }, [])
  return html`<preview-title .value=${comp.title}></preview-title><preview-description .value=${comp.description}></preview-description><preview-component .value=${comp.preview}></preview-component>`
},
window.HTMLElement,
{ useShadowDOM: false })

window.customElements.define('preview-component', PreviewComponent)
window.customElements.define('preview-description', PreviewDescription)
window.customElements.define('preview-title', PreviewTitle)
window.customElements.define('preview-app', PreviewApp)
