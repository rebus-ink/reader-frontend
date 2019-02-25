import {html} from 'lighterhtml'
import {arrify} from '../utils/arrify.js'
import {bookCard} from './book-card.js'

export function library (context) {
  return html`
  <main class="Library" id="Library">
  <div class="LibraryMenu"><details class="MenuButton">
  <summary class="MenuButton-summary">Library</summary>
  <details-menu role="menu" class="MenuButton-body">
    <ol>
    <li><a href="/Library">Library</a></li>
    <li><a href="/Import">Import</a></li>
    </ol>
  </details-menu>
  </details></div>
  <div class="Library-books">${arrify(context.items).map(book =>
    bookCard(book)
  )}</div>
</main>`
}
