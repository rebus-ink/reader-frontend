import { bookCardView } from './book-card.js'
// Returns a list of BookCards
export const libraryBooksView = (
  render,
  model
) => render`<main id="library" class="Library">
  ${model.books.map(book => bookCardView(render, book))}
</main>`
