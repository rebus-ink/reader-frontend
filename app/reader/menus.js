import component, {html} from 'neverland'

export const topMenu = component(() => {
  return html`<ol class="App-menu-list"><li><button class="App-button" data-component="sidebar-toggle" data-sidebar='left-sidebar' aria-label="Show left sidebar" aria-expanded="true"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg></button></li><li><button class="App-button" data-component="sidebar-toggle" data-sidebar='right-sidebar' aria-label="Show right sidebar" aria-expanded="true"><svg fill="none" stroke="currentColor" stroke-width="2" width="24" height="24" viewBox="0 0 24 24"><rect width="18" height="18" x="4" y="4"></rect><line y1="4" x2="17" x1="17" y2="22"></line></svg></button></li></ol>`
})

export const bottomMenu = component(() => {
  return html`<ol class="App-menu-list"><li><a href="/library">Library</a></li></ol>`
})
