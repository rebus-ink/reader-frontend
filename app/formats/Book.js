import nanobus from 'nanobus'
const bus = nanobus()

// The primary purpose of the Book class is to provide messaging features and the activities interface.

let activities
export class Book {
  constructor (publication = {}) {
    // We will need to convert between web publications and activities at some point.
    this.publication = publication
  }
  static activities (mod) {
    activities = mod
  }
  emit (eventName, data) {
    return bus.emit(eventName, data)
  }
  // This should use nanobus
  // Events:
  // - `changed`: This book has changed
  // - `chapter`: a chapter has been fetched
  // - `pending-change`: change in state of one of the pending updates.
  // - `added-to-collection`: the book has been added to a collection
  // - `removed-from-collection`:  the book has been removed from a collection
  // - `deleted`: the book has been deleted
  // - `preview`: a preview for the book
  // - `error`: something went wrong
  on (eventName, listener) {
    return bus.on(eventName, listener)
  }
  once (eventName, listener) {
    return bus.once(eventName, listener)
  }
  removeListener (eventName, listener) {
    return bus.removeListener(eventName, listener)
  }
  get activities () {
    return activities
  }
  toJSON () {
    return this.publication
  }
  get base () {
    if (this._url) {
      return this._url
    } else {
      const id = new URL(this.id, window.location)
      this._url = `${window.location.protocol}//${window.location.host}/reader${id.pathname}/`
      return this._url
    }
  }
}
