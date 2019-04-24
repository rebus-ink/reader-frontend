
import * as activities from '../state/activities.js'
// import {errorEvent} from '../utils/error-event.js'
import {Book} from '../formats/Book.js'
import {Article} from '../formats/Article.js'
import {Epub} from '../formats/Epub/index.js'
Book.activities(activities)

const uploadingFiles = new Set()

let zip
/* istanbul ignore next */
function zipModule () {
  zip = import('./zip.js')
  return zip
}

export function setState (state, status) {
  return {...state, uploads: Array.from(uploadingFiles), status}
}
/* istanbul ignore next */
export function reducer (state, action) {
  let status = 'loaded'
  switch (action.type) {
    // This action is called by the main library component on every render.
    case 'loading':
      loading(state, action.dispatch, activities)
      status = 'loaded'
      break
    case 'update':
      state = action.state
      status = 'updated'
      break
    case 'upload-queued':
      status = 'upload-queued'
      break
    case 'file':
      add(action, {activities, Epub, Article, zipModule})
      status = 'file'
      break
    case 'files':
      addFiles(action, {activities, Epub, Article, zipModule})
      status = 'files'
      break
    case 'article':
      add(action, {activities, Epub, Article, zipModule})
      status = 'article'
      break
    case 'create-collection':
      createCollection(action)
      status = 'creating-collection'
      break
    case 'add-to-collection':
      addToCollection(action)
      status = 'adding-to-collection'
      break
    case 'remove-from-collection':
      removeFromCollection(action)
      status = 'removing-from-collection'
      break
    case 'activities-update':
      activitiesUpdate(action, activities)
      status = 'activities-update'
      break
    case 'error-event':
      console.error(action.err)
      status = 'error-event'
      break
    default:
      return setState(state, status)
  }
  return setState(state, status)
}

export async function activitiesUpdate ({activity, payload, dispatch}, activities) {
  try {
    await activities[activity](payload)
    dispatch({type: 'loading', dispatch})
  } catch (err) {
    if (err.response && err.response.status === 400) {
      dispatch({type: 'loading', dispatch})
    } else {
      dispatch({type: 'error-event', err})
    }
  }
}

export function addFiles ({files, url, dispatch}, context) {
  for (let file of files) {
    add({file, url, dispatch}, context)
  }
}

export function add ({file = {}, url, dispatch}, context) {
  uploadingFiles.add({file, name: file.name, type: file.type, url, dispatch})
  queue(context)
}

let pending

function queue (context) {
  const uploading = Array.from(uploadingFiles)
  if (!pending && uploading[0]) {
    pending = taskPromise(uploading[0], context)
  }
}

async function taskPromise (action, context) { // testable
  const {activities, Epub, Article, zipModule} = context
  const {file, url, dispatch} = action
  console.log('queueing new book')
  let book
  if (file && file.type === 'application/epub+zip') {
    await zipModule()
    const preview = new Epub()
    const detail = { file, fileName: file.name }
    book = await preview.initAsync({detail})
  } else if (url) {
    const preview = new Article()
    book = await preview.initAsync(url)
  }
  dispatch({type: 'upload-queued'})
  return book.uploadMedia()
    .then(() => {
      return activities.create(book.activity)
    }).then(() => {
      pending = null
      uploadingFiles.delete(action)
      dispatch({type: 'loading', dispatch})
      queue(context)
    })
    .catch(err => {
      err.httpMethod = 'Book Upload'
      err.book = book
      dispatch({type: 'error-event', err})
    })
}

export async function loading (state, dispatch, activities) {
  try {
    const newState = await activities.library()
    dispatch({type: 'update', state: newState})
  } catch (err) {
    console.error(err)
    dispatch({type: 'error-event', err})
  }
}

export function createCollection (action) {
  const {dispatch} = action
  const payload = {
    type: 'reader:Stack',
    name: action.tag.name
  }
  dispatch({type: 'activities-update', dispatch, payload, activity: 'create'})
}

export function removeFromCollection (action) {
  const {dispatch} = action
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
  dispatch({type: 'activities-update', dispatch, payload, activity: 'remove'})
}

export function addToCollection (action) {
  const {dispatch} = action
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
  dispatch({type: 'activities-update', dispatch, payload, activity: 'add'})
}
