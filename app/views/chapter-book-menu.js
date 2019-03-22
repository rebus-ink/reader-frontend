
import {html} from 'lighterhtml'
import {arrify} from '../utils/arrify.js'

// Need to make sure this has a return link and location markers
export function bookMenu (state) {
  const {book} = state
  return html`<details class="MenuButton">
  <summary class="MenuButton-summary">${book.name}</summary>
  <ol class="MenuButton-body">
  <li><a href="/library" class="MenuItem">Return to Library</a></li>
  <li><hr class="MenuButton-separator"></li>
  <li>
    <ol>${renderToC(state)}</ol>
  </li>
  </ol>
  </details>`
}

export function renderToC (state) {
  const {book, bookId, bookPath} = state
  return arrify(book.orderedItems).map((chapter, index) => {
    const url = `/reader/${bookId}/${
      chapter['reader:path']
    }`
    const isSelected =
      bookPath === chapter['reader:path']
        ? 'is-selected'
        : ''
    const ariaCurrent = bookPath ? 'page' : false
    return html`<li class="${isSelected}"><a href="${url}" class="MenuItem" aria-current=${ariaCurrent}>${
      chapter.name
    }</a></li>`
  })
}
