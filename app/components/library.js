import {html} from 'lighterhtml'
import {arrify} from '../utils/arrify.js'
import {bookCard} from './book-card.js'

export function library (context) {
  const title = 'Library'
  const bookCount = arrify(context.items).length
  const path = window.location.pathname
  const search = window.location.search
  return html`
  <main class="Library" id="Library">
  <div class="Library-header">
    <h1 class="Library-title">${title}</h1>
    <nav class="Library-buttons">
    <ol class="Library-buttons-list">
    <!-- <li class="Library-buttons-item"><a href="/Import" class="MenuItem">Create Collection</a></li> -->
    <li class="Library-buttons-item"><a href="/library/import" class="MenuItem">Import</a></li>
    <!-- <li class="Library-buttons-item"><a href="/logout" class="MenuItem">Sign Out</a></li> -->
    </ol></nav>
    <p class="Library-info">${bookCount} items in collection</p>
    <p class="Library-info Library-info--right">Ordered by <select class="LibrarySelect" onchange="${orderChange}">
<option value="${path}" selected=${!search}>Date added</option>
<option value="${`${path}?order=added&desc=true`}" selected=${search === '?order=added&desc=true'}>Date added, reversed</option>
<option value="${`${path}?order=alpha`}" selected=${search === '?order=alpha'}>Alphabetical</option>
<option value="${`${path}?order=alpha&desc=true`}" selected=${search === 'order=alpha&desc=true'}>Alphabetical, reversed</option>
</select></p>
  </div>
  <div class="Library-books">${arrify(context.items).map(book =>
    bookCard(book)
  )}</div>
</main>`
}

function orderChange (event) {
  document.body.dispatchEvent(
    new window.CustomEvent('reader:navigation', {
      detail: { path: event.target.value }
    })
  )
}
