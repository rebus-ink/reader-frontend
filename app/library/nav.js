import wickedElements from 'wicked-elements'
import {render, html} from 'lighterhtml'
import {on} from '../state/main.js'
import {arrify} from '../utils/arrify.js'
import MicroModal from 'micromodal'
import {logoutModal} from '../components/logout-login-modals.js'
import {createCollectionModal} from './create-collection.js'

wickedElements.define('[data-component="library-nav"]', {
  async onconnected (event) {
    on('state', (state) => this.setState(state))
    this.element = event.currentTarget
    this.render()
  },
  setState (state) {
    this.state = state
    this.render()
  },
  ondisconnected (event) {
  },
  render () {
    if (this.state) {
      render(this.element, () => view(this.state))
    }
  }
})

function view (state) {
  return html`
  <div class="App-menu"><ol class="App-menu-list"><li><button class="App-sidebar-closer App-button" data-sidebar='left-sidebar' data-component="sidebar-toggle" aria-label="Close library navigation sidebar">&times;</button></li><li><h1 class="App-title">Library</h1></li><li><details class="MenuButton">
  <summary class="MenuButton-summary App-button" aria-label="Library actions">...</summary>
  <details-menu role="menu" class="MenuButton-body MenuButton-body--right">
  <button role="menuitem" class="MenuItem" onclick="${() => {
    createCollectionModal(document.getElementById('modal-1'))
    MicroModal.show('modal-1')
  }}">New collection...</button>
  <button role="menuitem" disabled class="MenuItem">Edit collections...</button>
  <button role="menuitem" href="/logout" class="MenuItem" onclick="${() => {
    logoutModal(document.getElementById('modal-1'))
    MicroModal.show('modal-1')
  }}">Sign out</button></details-menu>
  </details></li></ol></div>
  <ol class="App-nav-list">${allView(state)}
${arrify(state.tags).map(tag => tagView(tag, state))}</ol>`
}

function allView (state) {
  const url = new URL(document.location)
  const query = url.searchParams
  let classList
  if (query.get('tag')) {
    classList = 'App-navbutton'
  } else {
    classList = 'App-navbutton App-navbutton--selected'
  }
  query.delete('tag')
  return html`<li><a class="${classList}" href="${url.href}">All (${arrify(state.items).length})</a></li>`
}

function tagView (tag, state) {
  const url = new URL(document.location)
  const query = url.searchParams
  let classList
  if (query.get('tag') === tag.name) {
    classList = 'App-navbutton App-navbutton--selected'
  } else {
    classList = 'App-navbutton'
  }
  query.set('tag', tag.name)
  return html`<li><a class="${classList}" href="${url.href}">${tag.name} (${tagLength(state.items, tag.name)})</a></li>`
}

function tagLength (items, tag) {
  const filtered = items.filter(item => {
    const tags = item.tags.map(tag => tag.name)
    return tags.indexOf(tag) !== -1
  })
  return filtered.length
}
