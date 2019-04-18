import {createRouter} from './utils/context-router.js'
import 'intersection-observer'
import '@github/details-menu-element'
import $, {useContext, useEffect, useReducer, html, render} from 'neverland'
import libraryRoute from './library/index.js'
import './components/components.js'

export const router = createRouter([libraryRoute])
router.init()
document.body.id = 'app'

const menu = $(() => {
  return html`<ol class="App-menu-list"><li><button class="App-button" data-component="sidebar-toggle" data-sidebar='left-sidebar' aria-label="Show left sidebar" aria-expanded="true"><svg fill="none" stroke="currentColor" stroke-width="2" width="24" height="24" viewBox="0 0 24 24"><rect width="18" height="18" x="4" y="4"></rect><line y1="4" x2="9" x1="9" y2="22"></line></svg></button></li><li><button class="App-button" data-component="sidebar-toggle" data-sidebar='right-sidebar' aria-label="Show right sidebar" aria-expanded="true"><svg fill="none" stroke="currentColor" stroke-width="2" width="24" height="24" viewBox="0 0 24 24"><rect width="18" height="18" x="4" y="4"></rect><line y1="4" x2="17" x1="17" y2="22"></line></svg></button></li></ol>`
})

const body = $(() => {
  const {request, main, name, leftSidebar, rightSidebar, reducer, focusEffect} = useContext(router.context)
  const [state, dispatch] = useReducer(reducer, {status: 'initial-state'})
  const context = {state, dispatch, request}
  useEffect(focusEffect)
  document.body.setAttribute('class', 'App ' + `${name}-container`)
  document.body.dataset.status = state.status
  const mainList = `${name} App-main`
  const leftList = `${name}-left App-sidebar App-sidebar--left`
  const rightList = `${name}-right App-sidebar App-sidebar--right`
  const menuList = `${name}-menu App-menu App-menu--center`
  return html`
  <nav class="${leftList}" id="left-sidebar">${leftSidebar(context)}</nav>
  <nav class="${menuList}">${menu(context)}</nav>
  <aside class="${rightList}" id="right-sidebar">${rightSidebar(context)}</aside>
  <main class="${mainList}" id="main" data-component="${main}">${main(context)}</main>
  <div id="modal-1" class="Modal" aria-hidden="true">
    <div tabindex="-1" data-micromodal-close class="Modal-overlay">
      <div role="dialog" class="Modal-container" aria-modal="true" aria-labelledby="modal-1-title" >
        <header>
          <h2 id="modal-1-title" class="Modal-title">${''}
          </h2>
          <button aria-label="Close modal" data-micromodal-close class="Modal-close App-button">&times;</button>
        </header>
        <div id="modal-1-content" class="Modal-content">${''}
        </div>
      </div>
    </div>
  </div>`
})
render(document.body, body)
