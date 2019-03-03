
import {html} from 'lighterhtml'
import {arrify} from '../utils/arrify.js'

export function floatingButtons (state) {
  const { book, bookId, bookPath } = state
  const params = {bookId, bookPath}
  state.params = params
  const navigation = getNav(book, params)
  let next, previous
  if (navigation) {
    next = navigation.next
    previous = navigation.previous
  }
  return html`<ul class="Layout-floating-buttons">
  <li><button class="Button Button--floating" is="remove-highlight-button" aria-label="Remove Highlight"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="butt" stroke-linejoin="arcs"><polygon points="14 2 18 6 7 17 3 17 3 13 14 2"></polygon><line x1="3" y1="22" x2="21" y2="22" stroke="#ccc" stroke-dasharray="3,3"></line></svg></button></li>
  <li><button class="Button Button--floating" is="highlight-button" aria-label="Highlight"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="butt" stroke-linejoin="arcs"><polygon points="14 2 18 6 7 17 3 17 3 13 14 2"></polygon><line x1="3" y1="22" x2="21" y2="22" stroke="#dcdc00"></line></svg></button></li>
  <li>${previousButton(state, previous)}</li>
  <li>${nextButton(state, next)}</li>
  </ul>`
}

function previousButton (state, previous) {
  const { params } = state
  if (previous) {
    return html`<a href="${url(
      params,
      previous
    )}" aria-label="Previous chapter" class="Button Button--floating"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="butt" stroke-linejoin="arcs"><path d="M19 12H6M12 5l-7 7 7 7"/></svg></a>`
  } else {
    return html`<a href="#" aria-label="Previous chapter" class="Button Button--floating Button--disabled" disabled><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="butt" stroke-linejoin="arcs"><path d="M19 12H6M12 5l-7 7 7 7"/></svg></a>`
  }
}

function nextButton (state, next) {
  const { params } = state
  if (next) {
    return html`<a href="${url(
      params,
      next
    )}" aria-label="Next chapter" class="Button Button--floating "><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="butt" stroke-linejoin="arcs"><path d="M5 12h13M12 5l7 7-7 7"/></svg></a>`
  } else {
    return html`<a href="#" aria-label="Next chapter" class="Button Button--floating Button--disabled" disabled><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="butt" stroke-linejoin="arcs"><path d="M5 12h13M12 5l7 7-7 7"/></svg></a>`
  }
}

function url (params, chapter) {
  return `/reader/${params.bookId}/${
    chapter['reader:path']
  }`
}

function getNav (book, params) {
  const currentPath = params.bookPath
  const items = arrify(book.orderedItems)
  const current = items.filter(chapter => {
    return currentPath === chapter['reader:path']
  })[0]
  const index = items.indexOf(current)
  const previous = items[index - 1]
  const next = items[index + 1]
  return {
    current,
    previous,
    next
  }
}
