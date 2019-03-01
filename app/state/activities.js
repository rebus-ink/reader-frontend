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
import {processChapter} from './process-chapter.js'

export class HTTPError extends Error {}
let token
document.addEventListener('DOMContentLoaded', function (event) {
  loadToken()
})

export function loadToken () {
  const metaEl = document.querySelector('[name="jwt-meta"]')
  token = metaEl.getAttribute('content')
}

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

async function refreshJWT () {
  const csurf = document.querySelector('meta[name="csrf-token"]').getAttribute('content')
  const response = await window.fetch('/refresh-token', {
    credentials: 'include',
    method: 'POST',
    headers: new window.Headers({
      'content-type': 'application/ld+json',
      'csrf-token': csurf
    })
  })
  if (!response.ok) {
    throw new HTTPError('JWT Refresh Error:', response.statusText)
  }
  return response.json()
}

// TODO: replace these two with cached calls to profile. Or an 'endpoints' endpoint?
// Or maybe this is fine as we aren't going to be doing SPA-style logins?
function getOutbox () {
  const metaEl = document.querySelector('[rel="rebus-outbox"]')
  return metaEl.getAttribute('href')
}
function getUpload () {
  const metaEl = document.querySelector('[rel="rebus-upload"]')
  return metaEl.getAttribute('href')
}
function getLibrary () {
  const metaEl = document.querySelector('[rel="rebus-library"]')
  return metaEl.getAttribute('href')
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

export function library () {
  const url = getLibrary()
  return get(url)
}

export function book (bookId) {
  const url = `/${bookId}`
  return get(url)
}

const cache = new Map()
export async function cacheBook (book, bookId) {
  const texts = []
  for (let index = 0; index < book.orderedItems.length; index++) {
    const doc = book.orderedItems[index]
    texts.push(getChapter(doc, bookId))
  }
  return Promise.all(texts)
}

export async function getChapter (doc, bookId) {
  const alt = getAlternate(doc)
  const cached = cache.get(alt)
  if (!cached) {
    const response = await window.fetch(`/process-chapter?resource=${encodeURIComponent(alt)}&path=${doc['reader:path']}&bookId=${bookId}`)
    if (!response.ok) {
      throw new HTTPError('Get Error:', response.statusText)
    }
    const text = await response.json()
    cache.set(alt, text.chapter)
    return text.chapter
  } else {
    return cached
  }
}

export async function chapter (doc, bookId) {
  const chapter = await getChapter(doc, bookId)
  return processChapter(chapter, doc)
}

export async function create (payload) {
  const JWT = await getJWT()
  const outbox = getOutbox()
  payload = wrap(payload)
  const response = await window.fetch(outbox, {
    credentials: 'include',
    method: 'POST',
    body: JSON.stringify(payload),
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

export async function upload (payload) {
  const JWT = await getJWT()
  const upload = getUpload()
  const response = await window.fetch(upload, {
    credentials: 'include',
    method: 'POST',
    body: payload,
    headers: new window.Headers({
      Authorization: `Bearer ${JWT}`
    })
  })
  if (!response.ok) {
    const err = new HTTPError('POST Error:', response.statusText)
    err.statusCode = response.status
    err.headers = response.headers
    err.response = response
    throw err
  }
  return response.json()
}

function wrap (payload) {
  if (payload.type !== 'Create') {
    return {
      '@context': [
        'https://www.w3.org/ns/activitystreams',
        { reader: 'https://rebus.foundation/ns/reader' }
      ],
      type: 'Create',
      object: payload
    }
  } else {
    return payload
  }
}
