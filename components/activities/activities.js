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

class HTTPError extends Error {}
let token
document.addEventListener('DOMContentLoaded', function (event) {
  const metaEl = document.querySelector('[name="jwt-meta"]')
  token = metaEl.getAttribute('content')
})

async function getJWT () {
  const decoded = jwtDecode(token)
  const date = new Date(decoded * 1000).getTime()
  const nowish = Date.now().getTime() - 60000
  if (date > nowish) {
    const response = await refreshJWT()
    token = response.token
  }
  return token
}

async function refreshJWT () {
  const response = await window.fetch('/refresh-token', {
    credentials: 'include',
    method: 'POST',
    headers: new window.Headers({
      'content-type': 'application/ld+json'
    })
  })
  if (!response.ok) {
    throw new HTTPError('POST Error:', response.statusText)
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

export async function create (payload) {
  const JWT = await getJWT()
  const outbox = getOutbox()
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
