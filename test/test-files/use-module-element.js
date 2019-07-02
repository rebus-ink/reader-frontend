import { html } from 'lit-html'
import { component } from 'haunted'
import { useModule } from '../../components/hooks/useModule.js'

export const passes = []
export const UseModuleElement = component(
  ({ path }) => {
    const module = useModule(path)
    passes.push(module)
    return html`<p>${module ? module.test : 'Module is loading'}</p>`
  },
  window.HTMLElement,
  { useShadowDOM: false }
)

// export const UseLazyModule = component(
//   ({ path }) => {
//     const module = useLazyModule(path)
//     return html`<p>${module ? module.test : 'Module is loading'}</p>`
//   },
//   window.HTMLElement,
//   { useShadowDOM: false }
// )

window.customElements.define('use-module-element', UseModuleElement)

// window.customElements.define('use-lazy-module', UseLazyModule)
