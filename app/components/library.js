import {html} from 'lighterhtml'
import {arrify} from '../utils/arrify.js'
import {bookCard} from './book-card.js'

export function library (context) {
  const title = 'Library'
  const bookCount = arrify(context.items).length
  return html`
  <main class="Library" id="Library">
  <div class="Library-header">
    <h1 class="Library-title">${title}</h1>
    <nav class="Library-buttons">
    <ol class="Library-buttons-list">
    <!-- <li class="Library-buttons-item"><a href="/Import" class="MenuItem">Create Collection</a></li> -->
    <li class="Library-buttons-item"><a href="/Import" class="MenuItem">Import</a></li>
    <!-- <li class="Library-buttons-item"><a href="/logout" class="MenuItem">Sign Out</a></li> -->
    </ol></nav>
    <p class="Library-info">${bookCount} items in collection</p>
    <p class="Library-info Library-info--right">Ordered by <select class="LibrarySelect">
<option>Date added</option>
<option>This is not functional yet</option>
<option>Date added, reversed</option>
<option>Alphabetical</option>
<option>Alphabetical, reversed</option>
</select></p>
  </div>
  <div class="Library-books">${arrify(context.items).map(book =>
    bookCard(book)
  )}</div>
</main>`
}
