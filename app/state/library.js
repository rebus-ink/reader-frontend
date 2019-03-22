import nanobus from 'nanobus'
import * as activities from '../activities.js'
import {ActivityBook, Book} from '../formats/Book.js'
const bus = nanobus()

let context = {
  activities
}
Book.activities(activities)

export function setContext (newContext) {
  context = newContext
  Book.activities(context.activities)
}

// What now?

// What does the library need to render?
// - Ordered collection

// What does the reader need to render?
// - Full book object with attachment
// - Processed markup for each chapter
// - Document object for each chapter
let reader

// page: returns an orderedCollection for that page in the library
// Currently the API server doesn't do pagination so pageNumber is ignored.
export async function page ({pageNumber, tag, order, direction}) {
  const result = await context.activities.library(tag)
  if (!reader) {
    reader = await context.activities.getProfile()
  }
  result.reader = reader
  if (order || direction) {
    result.items = sortBooks(result.items, {order, direction})
  }
  bus.emit('page', result)
  return result
}

export async function book (id) {
  const book = new ActivityBook(await context.activities.book(id))
  if (!reader) {
    reader = await context.activities.getProfile()
  }
  book.reader = reader
  bus.emit('book', book)
  return book
}

// This should use nanobus
// Events:
// - `page`: a library page has been fetched
// - `book`: a book has been fetched
// - `pending-change`: change in state of one of the pending updates.
// - `added`: a book has been imported
// - `preview`: a preview for an import has been created
export function on (eventName, listener) {
  bus.on(eventName, listener)
}
export function once (eventName, listener) {
  bus.once(eventName, listener)
}
export function removeListener (eventName, listener) {
  bus.removeListener(eventName, listener)
}

export async function preview ({file, url}) {}

// Array of book objects being uploaded
//
export async function pending () {}
export async function add (book) {}
//
// Figure out imports!

function sortBooks (items, query) {
  const order = query.order
  if (order === 'alpha') {
    items = items.sort((first, second) => {
      return first.name.localeCompare(second.name)
    })
  } else {
    items = items.sort((first, second) => {
      return (first.published < second.published) ? -1 : ((first.published > second.published) ? 1 : 0)
    })
  }
  const direction = query.direction
  if (direction) {
    items = items.reverse()
  }
  return items
}
