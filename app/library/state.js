import * as activities from '../state/activities.js'
// import {errorEvent} from '../utils/error-event.js'
import { Book } from '../formats/Book.js'
import { Article } from '../formats/Article.js'
import { Epub } from '../formats/Epub/index.js'
import { createContext } from 'neverland'
Book.activities(activities)

// The contexts we need are uploadingFiles and libraryState
export const uploadingFiles = createContext([])
function removeUploadingFile (file) {
  const set = new Set(uploadingFiles.value)
  set.delete(file)
  uploadingFiles.provide(Array.from(set))
}
function addUploadingFile (file) {
  const set = new Set(uploadingFiles.value)
  set.add(file)
  uploadingFiles.provide(Array.from(set))
}

export const libraryState = createContext({ status: 'initial-state' })

let zip
/* istanbul ignore next */
function zipModule () {
  zip = import('./zip.js')
  return zip
}

export function setState (state, status) {
  state.status = status
  libraryState.provide(state)
  return state
}
/* istanbul ignore next */
export function dispatch (action) {
  const state = libraryState.value
  switch (action.type) {
    // This action is called by the main library component on every render.
    case 'loading':
      loading(state, dispatch, activities)
      break
    case 'update':
      setState(action.state, 'loaded')
      break
    case 'upload-queued':
      break
    case 'file':
      add(action, { activities, Epub, dispatch, Article, zipModule })
      break
    case 'files':
      addFiles(action, { activities, Epub, dispatch, Article, zipModule })
      break
    case 'article':
      add(action, { activities, Epub, dispatch, Article, zipModule })
      break
    case 'create-collection':
      createCollection(action, dispatch)
      break
    case 'add-to-collection':
      addToCollection(action, dispatch)
      break
    case 'remove-from-collection':
      removeFromCollection(action, dispatch)
      break
    case 'activities-update':
      activitiesUpdate(action, dispatch, activities)
      break
    case 'error-event':
      console.error(action.err, dispatch)
      break
    default:
      return setState(state, 'dispatching')
  }
}

export async function activitiesUpdate (
  { activity, payload },
  dispatch,
  activities
) {
  try {
    await activities[activity](payload)
    dispatch({ type: 'loading' })
  } catch (err) {
    if (err.response && err.response.status === 400) {
      dispatch({ type: 'loading' })
    } else {
      dispatch({ type: 'error-event', err })
    }
  }
}

export function addFiles ({ files, url }, context) {
  for (let file of files) {
    add({ file, url }, context)
  }
}

export function add ({ file = {}, url }, context) {
  addUploadingFile({ file, name: file.name, type: file.type, url })
  queue(context)
}

let pending

function queue (context) {
  const uploading = Array.from(uploadingFiles.value)
  if (!pending && uploading[0]) {
    pending = taskPromise(uploading[0], context)
  }
}

async function taskPromise (action, context) {
  const { activities, Epub, Article, zipModule, dispatch } = context
  const { file, url } = action
  let book
  if (file && file.type === 'application/epub+zip') {
    await zipModule()
    const preview = new Epub()
    const detail = { file, fileName: file.name }
    book = await preview.initAsync({ detail })
  } else if (url) {
    const preview = new Article()
    book = await preview.initAsync(url)
  }
  dispatch({ type: 'upload-queued' })
  return book
    .uploadMedia()
    .then(() => {
      return activities.create(book.activity)
    })
    .then(() => {
      pending = null
      removeUploadingFile(action)
      dispatch({ type: 'loading' })
      queue(context)
    })
    .catch(err => {
      err.httpMethod = 'Book Upload'
      err.book = book
      dispatch({ type: 'error-event', err })
    })
}

export async function loading (state, dispatch, activities) {
  let newState
  try {
    newState = await activities.library()
  } catch (err) {
    console.error(err)
  }
  dispatch({ type: 'update', state: newState })
}

export function createCollection (action, dispatch) {
  const payload = {
    type: 'reader:Stack',
    name: action.tag.name
  }
  dispatch({ type: 'activities-update', payload, activity: 'create' })
}

export function removeFromCollection (action, dispatch) {
  const payload = {
    type: 'Remove',
    object: {
      type: 'reader:Stack',
      id: action.tag.id,
      name: action.tag.name
    },
    target: {
      id: action.book
    }
  }
  dispatch({ type: 'activities-update', payload, activity: 'remove' })
}

export function addToCollection (action, dispatch) {
  const payload = {
    type: 'Add',
    object: {
      type: 'reader:Stack',
      id: action.tag.id,
      name: action.tag.name
    },
    target: {
      id: action.book
    }
  }
  dispatch({ type: 'activities-update', payload, activity: 'add' })
}
