const { getId } = require('./utils/get-id.js')
// const debug = require('debug')('vonnegut:views:floatingButtons')
module.exports.floatingButtons = (render, model, req) => {
  const { book } = model
  let next, previous
  if (book.navigation) {
    next = book.navigation.next
    previous = book.navigation.previous
  }
  return render(model, ':floatingButtons')`<ul class="Layout-floating-buttons">
  <li>
  <button class="Button Button--highlight" is="remove-highlight-button">Remove Highlight</button></li>
  <button class="Button Button--highlight" is="highlight-button">Highlight</button></li>
  <li>${previousButton(render, book, previous, req)}</li>
  <li>${nextButton(render, book, next, req)}</li>
  </ul>`
}

function previousButton (render, book, previous, req) {
  if (previous) {
    return render(book, ':floatingPrevious')`<a href="${url(
      book,
      previous,
      req
    )}" aria-label="Previous chapter" class="ArrowButton ArrowButton--previous"><svg viewBox="0 0 10 10" width="36" height="36" fill="currentColor">
    <path d="m9 4h-4v-2l-4 3 4 3v-2h4z"/>
    </svg></a>`
  } else {
    return render(
      book,
      ':floatingPrevious'
    )`<a href="#" aria-label="Previous chapter" class="ArrowButton ArrowButton--previous ArrowButton--disabled" disabled><svg viewBox="0 0 10 10" width="36" height="36" fill="currentColor">
    <path d="m9 4h-4v-2l-4 3 4 3v-2h4z"/>
    </svg></a>`
  }
}

function nextButton (render, book, next, req) {
  if (next) {
    return render(book, ':floatingNext')`<a href="${url(
      book,
      next,
      req
    )}" aria-label="Next chapter" class="ArrowButton ArrowButton--next"><svg viewBox="0 0 10 10" width="36" height="36" fill="currentColor">
    <path d="m1 4h4v-2l4 3-4 3v-2h-4z"/>
    </svg></a>`
  } else {
    return render(
      book,
      ':floatingNext'
    )`<a href="#" aria-label="Next chapter" class="ArrowButton ArrowButton--next ArrowButton--disabled" disabled><svg viewBox="0 0 10 10" width="36" height="36" fill="currentColor">
    <path d="m1 4h4v-2l4 3-4 3v-2h-4z"/>
    </svg></a>`
  }
}

function url (book, chapter, req) {
  return `/reader/${encodeURIComponent(getId(book.id))}/${
    chapter['reader:path']
  }`
}
