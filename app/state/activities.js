/* This module needs to:

- Get JWT, decode using https://github.com/auth0/jwt-decode and check expiry.
- Renew JWT if expired or less than 10 seconds away from expiry
- Get configuration from profile
- Send new activities to outbox. Including:
  - Create publication
  - Create document
  - Create note
  - Update publication/document/note
  - Delete publication/document/note
  - Read activity
- Upload file
- Fetch library
- Fetch publication
- Fetch chapter (including markup)

should be initially based on fetch.js

*/
import jwtDecode from 'jwt-decode'
import {getAlternate} from './get-alternate.js'

export class HTTPError extends Error {}

function postError (response) {
  const err = new HTTPError('POST Error:', response.statusText)
  err.statusCode = response.status
  err.headers = response.headers
  err.response = response
  return err
}

let token
async function getJWT () {
  if (!token) {
    const response = await refreshJWT()
    token = response.token
  } else {
    const decoded = jwtDecode(token)
    const date = decoded.exp * 1000
    const nowish = Date.now() + 60000
    if (date < nowish) {
      const response = await refreshJWT()
      token = response.token
    }
  }
  return token
}

export function logout () {
  token = null
}

async function refreshJWT () {
  const csurfMeta = document.querySelector('meta[name="csrf-token"]')
  let csurf
  if (csurfMeta) {
    csurf = csurfMeta.getAttribute('content')
  }
  const response = await window.fetch('/refresh-token', {
    credentials: 'include',
    method: 'POST',
    headers: new window.Headers({
      'content-type': 'application/ld+json',
      'csrf-token': csurf
    })
  })
  if (response.status === 403) {
    document.body.dispatchEvent(
      new window.CustomEvent('reader:login', {
        detail: { response }
      }))
  }
  if (!response.ok) {
    throw new HTTPError('JWT Refresh Error:', response.statusText)
  }
  return response.json()
}

// TODO: replace these two with cached calls to profile. Or an 'endpoints' endpoint?
// Or maybe this is fine as we aren't going to be doing SPA-style logins?
async function getOutbox () {
  const profile = await getProfile()
  return profile.outbox
}
async function getUpload () {
  const profile = await getProfile()
  return `${profile.id}/file-upload`
}
async function getLibrary () {
  const profile = await getProfile()
  return profile.streams.items[0].id
}
let profile
export async function getProfile () {
  if (profile) { return profile }
  const JWT = await getJWT()
  const response = await window.fetch('/whoami', {
    headers: new window.Headers({
      'content-type': 'application/ld+json',
      Authorization: `Bearer ${JWT}`
    })
  })
  if (response.ok) {
    profile = await response.json()
  } else if (response.status === 404) {
    const sub = document.getElementById('sub-user-id').getAttribute('content')
    const newReader = {
      type: 'Person',
      summary: `Reader profile for user id ${sub}`
    }
    const response = await window.fetch('/readers', {
      credentials: 'include',
      method: 'POST',
      body: JSON.stringify(newReader),
      headers: new window.Headers({
        'content-type': 'application/ld+json',
        Authorization: `Bearer ${JWT}`
      })
    })
    if (!response.ok) {
      throw new HTTPError('POST Error:', response.statusText)
    }
    const reader = await get(response.headers.get('location'))
    profile = reader
  } else {
    window.alert('Logging in failed')
  }
  return profile
}
export async function updateProfile () {
  profile = await get(profile.id)
  return profile
}

export async function get (url) {
  const JWT = await getJWT()
  const response = await window.fetch(url, {
    headers: new window.Headers({
      'content-type': 'application/ld+json',
      Authorization: `Bearer ${JWT}`
    })
  })
  if (!response.ok) {
    throw new HTTPError('Get Error:', response.statusText)
  }
  return response.json()
}

const notes = new Map()
export function saveNote (note) {
  notes.set(note.id, note)
}
export function note (id) {
  return notes.get(id)
}

export async function library (tag) {
  const url = new URL(await getLibrary())
  if (tag) {
    url.searchParams.set('stack', tag)
  }
  return get(url)
}
const bookCache = {}
export async function book (bookId) {
  const url = `/${bookId}`
  if (url === bookCache.id) {
    return bookCache.data
  } else {
    const data = await get(url)
    bookCache.id = url
    bookCache.data = data
    return data
  }
}

export async function getChapterMarkup (doc, bookId) {
  const alt = getAlternate(doc)
  const response = await window.fetch(`/process-chapter?resource=${encodeURIComponent(alt)}&path=${doc['reader:path']}&bookId=${bookId}`)
  if (!response.ok) {
    throw new HTTPError('Get Error:', response.statusText)
  }
  const text = await response.json()
  return text.chapter
}
export async function saveActivity (action) {
  const JWT = await getJWT()
  const outbox = await getOutbox()
  const response = await window.fetch(outbox, {
    credentials: 'include',
    method: 'POST',
    body: JSON.stringify(action),
    headers: new window.Headers({
      'content-type': 'application/ld+json',
      Authorization: `Bearer ${JWT}`
    })
  })
  if (!response.ok) {
    throw new HTTPError('POST Error:', response.statusText)
  }
  return response.headers.get('location')
}

export function create (payload) {
  const action = wrap(payload, 'Create')
  return saveActivity(action)
}
export function add (payload) {
  const action = wrap(payload, 'Add')
  return saveActivity(action)
}

export function update (payload) {
  const action = wrap(payload, 'Update')
  return saveActivity(action)
}

export function deleteActivity (payload) {
  const action = wrap(payload, 'Delete')
  return saveActivity(action)
}

export async function createAndGetId (payload) {
  const location = await create(payload)
  const JWT = await getJWT()
  const response = await window.fetch(location, {
    headers: new window.Headers({
      'content-type': 'application/ld+json',
      Authorization: `Bearer ${JWT}`
    })
  })
  if (!response.ok) {
    throw new HTTPError('Get Error:', response.statusText)
  }
  const json = await response.json()
  if (json.type === 'Note') {
    saveNote(json)
  }
  return json.id
}

export async function upload (payload) {
  const JWT = await getJWT()
  const upload = await getUpload()
  const response = await window.fetch(upload, {
    credentials: 'include',
    method: 'POST',
    body: payload,
    headers: new window.Headers({
      Authorization: `Bearer ${JWT}`
    })
  })
  if (!response.ok) {
    const err = postError(response)
    throw err
  }
  return response.json()
}

function wrap (payload, type) {
  if (payload.type !== type) {
    return {
      '@context': [
        'https://www.w3.org/ns/activitystreams',
        { reader: 'https://rebus.foundation/ns/reader' }
      ],
      type,
      object: payload
    }
  } else {
    return payload
  }
}
