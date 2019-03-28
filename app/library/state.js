
import * as activities from '../state/activities.js'
import {Book} from '../formats/Book.js'
import {Article} from '../formats/Article.js'
import {Epub} from '../formats/Epub/index.js'
import EventEmitter from 'eventemitter3'
import {errorEvent} from '../utils/error-event.js'
const bus = new EventEmitter()

let context = {
  activities
}
Book.activities(activities)

export function setTestContext (newContext) {
  context = newContext
  Book.activities(context.activities)
}

const uploadingFiles = new Set()
const state = {
  library: {}
}
export async function library () {
  const result = await context.activities.library()
  state.library = result
  bus.emit('library', result)
  return result
}

export function uploads () {
  return Array.from(uploadingFiles)
}

export async function addFiles (files = []) {
  for (let file of files) {
    await add({file})
  }
}

export async function add ({file, url}) {
  let book
  if (file && file.type === 'application/epub+zip') {
    await import('./zip.js')
    const preview = new Epub()
    const detail = { file, DOMAIN: `${window.location.protocol}//${window.location.host}/`, fileName: file.name }
    book = await preview.initAsync({detail})
  } else if (url) {
    const preview = new Article()
    book = await preview.initAsync(url)
  } else {
    return null
  }
  uploadingFiles.add(book)
  bus.emit('queued', book)
  queue()
}
let pending
function queue () {
  const uploading = Array.from(uploadingFiles)
  if (!pending && uploading[0]) {
    pending = taskPromise(uploading[0])
  }
}
function taskPromise (book) {
  console.log('queueing new book')
  return book.uploadMedia()
    .then(() => {
      return activities.create(book.activity)
    }).then(() => {
      pending = null
      uploadingFiles.delete(book)
      bus.emit('added', book)
      queue()
    })
    .catch(err => {
      err.httpMethod = 'Book Upload'
      err.book = book
      bus.emit('error', err)
      errorEvent(err)
    })
}

export function on (eventName, listener) {
  bus.on(eventName, listener)
}
export function once (eventName, listener) {
  bus.once(eventName, listener)
}
export function removeListener (eventName, listener) {
  bus.removeListener(eventName, listener)
}
