
import {Library} from './component-library.js'
import {Nav} from './component-nav.js'
import {Info} from './component-info.js'
import {dispatch, libraryState} from './state.js'
import $, {useContext, html} from 'neverland'
import * as activities from '../state/activities.js'

const menu = $((context, h) => {
  return html`<ol class="App-menu-list">${Nav(context, h)}<li></li></ol>`
})
const bottomMenu = $(() => {
  return html`<ol class="App-menu-list"><li></li></ol>`
})

const name = 'library'
const path = '/library/:bookId?'
const root = '#library'

async function load () {
  try {
    const newState = await activities.library()
    dispatch({type: 'update', state: newState})
  } catch (err) {
    console.error(err)
    dispatch({type: 'error-event', err})
  }
}

const render = $((context, h) => {
  console.log('library render called')
  const state = useContext(libraryState)
  h.provides('dispatch', dispatch)
  h.provides('load', load)
  context.state = state
  context.root = document.querySelector(root)
  context.root.setAttribute('class', 'App ' + `${name}-container`)
  context.root.dataset.status = state.status
  if (state.status === 'initial-state' && context.root.dataset.active) {
    load()
  }
  const mainList = `${name} App-main`
  const infoList = `${name}-info App-main App-main--info`
  const leftList = `${name}-left`
  const rightList = `${name}-right`
  const menuList = `${name}-menu App-menu App-menu--center`
  const bottomMenuList = `${name}-menu App-menu App-menu--bottom App-menu--center`
  return html`
  <div class="${leftList}" id="left-library-sidebar" data-root=${root} data-sidebar></div>
  <nav class="${menuList}">${menu(context, h)}</nav>
  <div class="${rightList}" id="right-library-sidebar" data-root=${root} data-sidebar></div>
  <div hidden="${!context.request.params.bookId}" class="${infoList}">${Info(context, h)}</div>
  <main hidden="${context.request.params.bookId}"  class="${mainList}" id="main">${Library(context, h)}</main>
  <nav class="${bottomMenuList}">${bottomMenu(context, h)}</nav>
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

const route = {
  root,
  path,
  name,
  render
}

export default route
