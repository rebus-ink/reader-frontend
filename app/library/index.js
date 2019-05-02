
import {Library} from './component-library.js'
import {nav} from './component-nav.js'
import {Shelf} from './component-shelf.js'
import {dispatch, libraryState} from './state.js'
import $, {useContext, html} from 'neverland'
import * as activities from '../state/activities.js'

const menu = $(() => {
  return html`<ol class="App-menu-list"><li><button class="App-button" data-component="sidebar-toggle" data-sidebar='left-sidebar' aria-label="Show left sidebar" aria-expanded="true"><svg fill="none" stroke="currentColor" stroke-width="2" width="24" height="24" viewBox="0 0 24 24"><rect width="18" height="18" x="4" y="4"></rect><line y1="4" x2="9" x1="9" y2="22"></line></svg></button></li><li><button class="App-button" data-component="sidebar-toggle" data-sidebar='right-sidebar' aria-label="Show right sidebar" aria-expanded="true"><svg fill="none" stroke="currentColor" stroke-width="2" width="24" height="24" viewBox="0 0 24 24"><rect width="18" height="18" x="4" y="4"></rect><line y1="4" x2="17" x1="17" y2="22"></line></svg></button></li></ol>`
})
const bottomMenu = $(() => {
  return html`<ol class="App-menu-list"><li></li></ol>`
})

const name = 'library'
const path = '/library'
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
  if (state.status === 'initial-state') {
    load()
  }
  document.querySelector(root).setAttribute('class', 'App ' + `${name}-container`)
  document.querySelector(root).dataset.status = state.status
  const mainList = `${name} App-main`
  context.leftList = `${name}-left App-sidebar App-sidebar--left`
  const rightList = `${name}-right App-sidebar App-sidebar--right`
  const menuList = `${name}-menu App-menu App-menu--center`
  const bottomMenuList = `${name}-menu App-menu App-menu--bottom App-menu--center`
  return html`${nav(context, h)}
  <nav class="${menuList}">${menu(context, h)}</nav>
  <aside class="${rightList}" id="right-sidebar">${Shelf(context, h)}</aside>
  <main class="${mainList}" id="main">${Library(context, h)}</main>
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
