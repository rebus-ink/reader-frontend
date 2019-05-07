import component, {html} from 'neverland'

export const topMenu = component(() => {
  return html`<ol class="App-menu-list"><li></li></ol>`
})

export const bottomMenu = component(() => {
  return html`<ol class="App-menu-list"><li><a href="/library">Library</a></li></ol>`
})
