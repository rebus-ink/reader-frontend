
import {Library} from './component-library.js'
import {nav} from './component-nav.js'
import {Shelf} from './component-shelf.js'
import {Info} from './component-info.js'
import {dispatch, libraryState} from './state.js'
import $, {useContext, html} from 'neverland'
import * as activities from '../state/activities.js'

const menu = $(() => {
  return html`<ol class="App-menu-list"><li><button class="App-button" data-component="sidebar-toggle" data-sidebar='left-library-sidebar' aria-label="Show left sidebar" aria-expanded="true"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg></button></li><li><button class="App-button" data-component="sidebar-toggle" data-sidebar='right-library-sidebar' aria-label="Show right sidebar" aria-expanded="true"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="round"><path d="M20 11.08V8l-6-6H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h6"/><path d="M14 3v5h5M18 21v-6M15 18h6"/></svg></button></li></ol>`
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
  if (state.status === 'initial-state') {
    load()
  }
  document.querySelector(root).setAttribute('class', 'App ' + `${name}-container`)
  document.querySelector(root).dataset.status = state.status
  const mainList = `${name} App-main`
  const infoList = `${name}-info App-main App-main--info`
  context.leftList = `${name}-left App-sidebar App-sidebar--left`
  const rightList = `${name}-right App-sidebar App-sidebar--right`
  const menuList = `${name}-menu App-menu App-menu--center`
  const bottomMenuList = `${name}-menu App-menu App-menu--bottom App-menu--center`
  return html`${nav(context, h)}
  <nav class="${menuList}">${menu(context, h)}</nav>
  <aside class="${rightList}" id="right-library-sidebar" data-root=${root} data-sidebar>${Shelf(context, h)}</aside>
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
