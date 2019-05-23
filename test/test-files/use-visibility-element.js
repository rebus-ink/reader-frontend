import { html } from 'lit-html'
import { component } from 'haunted'
import { useVisibility } from '../../components/hooks/useVisibility.js'

export const UseVisibilityElement = component(
  () => {
    const [visibility, entry] = useVisibility()
    return html`<p>${visibility ? 'visible' : 'not visible'}</p>`
  },
  window.HTMLElement,
  { useShadowDOM: false }
)

window.customElements.define('use-visibility', UseVisibilityElement)
