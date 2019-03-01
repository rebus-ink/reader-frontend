
import {html} from 'lighterhtml'
import {arrify} from '../utils/arrify.js'

export function floatingButtons (state) {
  const { book, params } = state
  const navigation = getNav(book, params)
  console.log(navigation)
  let next, previous
  if (navigation) {
    next = navigation.next
    previous = navigation.previous
  }
  return html`<ul class="Layout-floating-buttons">
  <li>
  <button class="Button Button--highlight" is="remove-highlight-button">Remove Highlight</button></li>
  <button class="Button Button--highlight" is="highlight-button">Highlight</button></li>
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
    )}" aria-label="Previous chapter" class="ArrowButton ArrowButton--previous"><svg viewBox="0 0 10 10" width="36" height="36" fill="currentColor">
    <path d="m9 4h-4v-2l-4 3 4 3v-2h4z"/>
    </svg></a>`
  } else {
    return html`<a href="#" aria-label="Previous chapter" class="ArrowButton ArrowButton--previous ArrowButton--disabled" disabled><svg viewBox="0 0 10 10" width="36" height="36" fill="currentColor">
    <path d="m9 4h-4v-2l-4 3 4 3v-2h4z"/>
    </svg></a>`
  }
}

function nextButton (state, next) {
  const { params } = state
  if (next) {
    return html`<a href="${url(
      params,
      next
    )}" aria-label="Next chapter" class="ArrowButton ArrowButton--next"><svg viewBox="0 0 10 10" width="36" height="36" fill="currentColor">
    <path d="m1 4h4v-2l4 3-4 3v-2h-4z"/>
    </svg></a>`
  } else {
    return html`<a href="#" aria-label="Next chapter" class="ArrowButton ArrowButton--next ArrowButton--disabled" disabled><svg viewBox="0 0 10 10" width="36" height="36" fill="currentColor">
    <path d="m1 4h4v-2l4 3-4 3v-2h-4z"/>
    </svg></a>`
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
