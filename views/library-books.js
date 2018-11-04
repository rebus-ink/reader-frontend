import { bookCardView } from './book-card.js'
import { topMenuMain } from './menus-main.js'
import { arrify } from './util-arrify.js'
// Returns a list of BookCards
export const libraryBooksView = (render, model) => render(
  model,
  ':libraryBooks'
)`<main class="Library" id="Library" tabindex="-1">
  ${topMenuMain(render, model)}
  <div class="Library-books">${arrify(model.books).map(book =>
    bookCardView(render, book)
  )}</div>
</main>`
