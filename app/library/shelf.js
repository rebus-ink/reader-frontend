import wickedElements from 'wicked-elements'
import {render, html} from 'lighterhtml'
import {on} from '../state/main.js'
// import {arrify} from '../utils/arrify.js'

wickedElements.define('[data-component="library-shelf"]', {
  async onconnected (event) {
    console.log(event)
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
  <div class="App-menu"><ol class="App-menu-list"><li><details class="MenuButton">
  <summary class="MenuButton-summary App-button" aria-label="Upload actions">...</summary>
  <details-menu role="menu" class="MenuButton-body">
  <button role="menuitem" class="MenuItem">Add web article...</button>
  <button role="menuitem" class="MenuItem">Upload file...</button>
  <button role="menuitem" disabled class="MenuItem">Clear finished uploads</button>
  </details-menu>
  </details></li><li><h2 class="App-title">Uploads</h2></li><li><button class="App-sidebar-closer App-button" data-sidebar='right-sidebar' data-component="sidebar-toggle" aria-label="Close library shelf sidebar">&times;</button></li></ol></div>
  <ol class="App-nav-list"></ol>`
}
