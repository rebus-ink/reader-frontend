
import {html} from 'lighterhtml'
import {arrify} from '../utils/arrify.js'

// Need to make sure this has a return link and location markers
export function tocSidebar (state) {
  const {book} = state
  return html`<nav class="NavSidebar NavSidebar--toc" id="NavSidebar" aria-labelledby="navsidebar-label">
  <p class="NavSidebar-title NavSidebar-body" id="navsidebar-label">${book.name}</p>
  <p class="NavSidebar-subtitle NavSidebar-body">Contents</p>
  <ol class="NavSidebar-body">
${renderToC(state)}
  </ol>
</nav>`
}

function renderToC (state) {
  const {book, bookId, bookPath} = state
  return arrify(book.orderedItems).map((chapter, index) => {
    const url = `/reader/${bookId}/${
      chapter['reader:path']
    }`
    const isSelected =
      bookPath === chapter['reader:path']
        ? 'NavSidebar-item is-selected'
        : 'NavSidebar-item'
    const ariaCurrent = bookPath ? 'page' : false
    return html`<li class="${isSelected}"><a href="${url}" class="NavSidebar-link" aria-current=${ariaCurrent}>${
      chapter.name
    }</a></li>`
  })
}
