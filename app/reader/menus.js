import component, {html} from 'neverland'

export const topMenu = component(() => {
  return html`<ol class="App-menu-list"><li><button class="App-button" data-component="sidebar-toggle" data-sidebar='left-sidebar' aria-label="Show left sidebar" aria-expanded="true"><svg fill="none" stroke="currentColor" stroke-width="2" width="24" height="24" viewBox="0 0 24 24"><rect width="18" height="18" x="4" y="4"></rect><line y1="4" x2="9" x1="9" y2="22"></line></svg></button></li><li><button class="App-button" data-component="sidebar-toggle" data-sidebar='right-sidebar' aria-label="Show right sidebar" aria-expanded="true"><svg fill="none" stroke="currentColor" stroke-width="2" width="24" height="24" viewBox="0 0 24 24"><rect width="18" height="18" x="4" y="4"></rect><line y1="4" x2="17" x1="17" y2="22"></line></svg></button></li></ol>`
})

export const bottomMenu = component(() => {
  return html`<ol class="App-menu-list"><li><a href="/library">Library</a></li></ol>`
})
