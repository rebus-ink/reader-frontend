import { html } from 'lit-html'
import { component } from 'haunted'
import { useRoutes } from '../../components/hooks/useRoutes.js'
const testRoute = {
  path: '/:testParam',
  prop: 'prop1'
}
const testRoute2 = {
  path: '/:testParam/:testParam2/:testParam3?',
  prop: 'prop2'
}
const fallbackRoute = {
  prop: 'prop3'
}
const routes = [testRoute, testRoute2, fallbackRoute]

export const UseRoutesElement = component(
  () => {
    const [route, req] = useRoutes(routes)
    return html`<p>${route.prop} and ${JSON.stringify(req.params)}</p>`
  },
  window.HTMLElement,
  { useShadowDOM: false }
)
export const UselessRoutesElement = component(
  () => {
    const [route, req] = useRoutes()
    return html`<p>${route.prop} and ${JSON.stringify(req.params)}</p>`
  },
  window.HTMLElement,
  { useShadowDOM: false }
)

window.customElements.define('use-routes', UseRoutesElement)
window.customElements.define('useless-routes', UselessRoutesElement)
