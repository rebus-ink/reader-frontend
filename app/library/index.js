import './library.js'
import './nav.js'
import './shelf.js'
import $, {html, useState, useContext, createContext} from 'neverland'

export const library = $((context) => {
  const {request, h} = useContext(context)
  const mainList = `library App-main`
  const leftList = `library-nav App-sidebar App-sidebar--left`
  const rightList = `library-shelf App-sidebar App-sidebar--right`
  const menuList = `library-menu App-menu App-menu--center`
  return html`
  <nav class="${leftList}" id="left-sidebar" data-component="library-nav"><ol class="App-nav-list"><li></li></ol></nav>
  <nav class="${menuList}" data-component="library-menu"><ol class="App-menu-list"><li><button class="App-button" data-component="sidebar-toggle" data-sidebar='left-sidebar' aria-label="Show left sidebar" aria-expanded="true"><svg fill="none" stroke="currentColor" stroke-width="2" width="24" height="24" viewBox="0 0 24 24"><rect width="18" height="18" x="4" y="4"></rect><line y1="4" x2="9" x1="9" y2="22"></line></svg></button></li><li><button class="App-button" data-component="sidebar-toggle" data-sidebar='right-sidebar' aria-label="Show right sidebar" aria-expanded="true"><svg fill="none" stroke="currentColor" stroke-width="2" width="24" height="24" viewBox="0 0 24 24"><rect width="18" height="18" x="4" y="4"></rect><line y1="4" x2="17" x1="17" y2="22"></line></svg></button></li></ol></nav>
  <aside class="${rightList}" data-component="library-shelf" id="right-sidebar"><ol class="App-nav-list"><li></li></ol></aside>
  <main class="${mainList}" id="main" data-component="library"></main>
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
