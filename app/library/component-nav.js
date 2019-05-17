
import component, {html, useRef} from 'neverland'
import {arrify} from '../utils/arrify.js'
import MicroModal from 'micromodal'
import {logoutModal} from '../components/logout-login-modals.js'
import {createCollectionModal} from './create-collection.js'

export const Nav = component(({state, leftList, root}, {dispatch}) => {
  const menuEl = useRef(null)
  const buttonEl = useRef(null)
  let expanded
  if (root) {
    if (root.dataset.toggleLeft === 'show') {
      expanded = true
    } else {
      expanded = false
    }
    if (root.style.getPropertyValue('--left-library-sidebar-width') === '0px') {
      expanded = false
    }
  }
  const context = {menuEl, buttonEl, root}
  if (state.items) {
    return html`<li>
    <button ref="${buttonEl}" aria-expanded="${expanded}" class="App-button" aria-label="Show left sidebar" onclick=${(event) => toggleMenu(event, context)}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg></button>
    <div hidden="${!expanded}" ref=${menuEl} class="App-sidebar App-sidebar--left">
    <div class="App-menu"><ol class="App-menu-list"><li></li><li><h1 class="App-title">Library</h1></li><li><details class="MenuButton">
    <summary class="MenuButton-summary App-button" aria-label="Library actions">...</summary>
    <details-menu role="menu" class="MenuButton-body MenuButton-body--right">
    <button role="menuitem" class="MenuItem" onclick="${() => {
    createCollectionModal(document.getElementById('modal-1'), dispatch)
    MicroModal.show('modal-1')
  }}">New collection...</button>
    <button role="menuitem" disabled class="MenuItem">Edit collections...</button>
    <button role="menuitem" href="/logout" class="MenuItem" onclick="${() => {
    logoutModal(document.getElementById('modal-1'))
    MicroModal.show('modal-1')
  }}">Sign out</button></details-menu>
    </details></li></ol></div>
    <ol class="App-nav-list">${allView(state, context)}
  ${arrify(state.tags).map(tag => tagView(tag, state, context))}</ol></div>
</li>`
  }
})

function toggleMenu (event, {menuEl, buttonEl, root}) {
  buttonEl.current.setAttribute('aria-expanded', menuEl.current.hidden)
  menuEl.current.hidden = !menuEl.current.hidden
  if (menuEl.current.hidden) {
    root.dataset.toggleLeft = 'hide'
  } else {
    root.dataset.toggleLeft = 'show'
  }
}

function toggleBouncer (event, context) {
  if (context.root.style.getPropertyValue('--left-library-sidebar-width') === '0px') return toggleMenu(event, context)
}

// These should handle aria-current
const allView = component((state, context) => {
  const url = new URL(document.location)
  const query = url.searchParams
  let classList
  if (query.get('tag')) {
    classList = 'App-navbutton'
  } else {
    classList = 'App-navbutton App-navbutton--selected'
  }
  query.delete('tag')
  return html`<li><a class="${classList}" href="${url.href}" onclick="${(event) => toggleBouncer(event, context)}"><span class="App-navbutton-label">All</span> <span class="App-navbutton-count">${arrify(state.items).length}</span></a></li>`
})

const tagView = component((tag, state, context) => {
  const url = new URL(document.location)
  const query = url.searchParams
  let classList
  if (query.get('tag') === tag.name) {
    classList = 'App-navbutton App-navbutton--selected'
  } else {
    classList = 'App-navbutton'
  }
  query.set('tag', tag.name)
  return html`<li><a class="${classList}" href="${url.href}" onclick="${(event) => toggleBouncer(event, context)}"><span class="App-navbutton-label">${tag.name}</span> <span class="App-navbutton-count">${tagLength(state.items, tag.name)}</span></a></li>`
})

function tagLength (items, tag) {
  const filtered = items.filter(item => {
    const tags = item.tags.map(tag => tag.name)
    return tags.indexOf(tag) !== -1
  })
  return filtered.length
}
