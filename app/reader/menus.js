import component, {html} from 'neverland'

export const topMenu = component(() => {
  return html`<ol class="App-menu-list"><li></li></ol>`
})

export const bottomMenu = component((context) => {
  return html`<ol class="App-menu-list"><li><a href="${context.book.previous}" class="App-button" hidden={!context.book.previous}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg></a></li><li><a href="/library" class="App-button">Library</a></li><li><a href="${context.book.next}" class="App-button"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg></a></li></ol>`
})
