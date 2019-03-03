import {html} from 'lighterhtml'

export function libraryLoading (context) {
  const title = 'Library'
  return html`
  <div class="Library-header">
    <h1 class="Library-title">${title}</h1>
    <nav class="Library-buttons">
    <ol class="Library-buttons-list">
    <!-- <li class="Library-buttons-item"><a href="/Import" class="MenuItem">Create Collection</a></li> -->
    <li class="Library-buttons-item"><a href="/library/import" class="MenuItem MenuItem--library">Import</a></li>
    <!-- <li class="Library-buttons-item"><a href="/logout" class="MenuItem">Sign Out</a></li> -->
    </ol></nav>
    <p class="Library-info">${'Unknown'} items in collection</p>
    <p class="Library-info Library-info--right">Ordered by <select class="LibrarySelect" disabled>
</select></p>
  </div>
  <div class="Library-books">
    <div class="Spinner">
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="3" stroke-linecap="square" stroke-linejoin="arcs"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg></div>
  </div>`
}
