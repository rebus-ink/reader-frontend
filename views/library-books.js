import { bookCardView } from './book-card.js'
import { topMenuMain } from './menus-main.js'
import { arrify } from './util-arrify.js'
// Returns a list of BookCards
export const libraryBooksView = (render, model) => render(
  model,
  ':libraryBooks'
)`${topMenuMain(render, model)}<main class="Library" id="Library">
  <div class="Library-books">${arrify(model.books).map(book =>
    bookCardView(render, book)
  )}</div>
</main>`
