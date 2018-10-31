import { bookCardView } from './book-card.js'
import { topMenuMain } from './menus-main.js'
// Returns a list of BookCards
export const libraryBooksView = (render, model) => render(
  model,
  ':libraryBooks'
)`<main id="library" class="Library">
  ${topMenuMain(render, model)}
  <div class="Library-books">${model.books.map(book =>
    bookCardView(render, book)
  )}</div>
</main>`
