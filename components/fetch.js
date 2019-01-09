class HTTPError extends Error {}

async function get (url) {
  const response = await window.fetch(url, { header: {} })
  if (!response.ok) {
    throw new HTTPError('Get Error:', response.statusText)
  }
  return response.json()
}

async function createPublication (payload) {
  const JWT = getJWT()
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

async function uploadFile (payload) {
  const JWT = getJWT()
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

window.get = get
window.createPublication = createPublication
window.uploadFile = uploadFile

function getJWT () {
  const metaEl = document.querySelector('[name="jwt-meta"]')
  return metaEl.getAttribute('content')
}

function getOutbox () {
  const metaEl = document.querySelector('[rel="rebus-outbox"]')
  return metaEl.getAttribute('href')
}

function getUpload () {
  const metaEl = document.querySelector('[rel="rebus-upload"]')
  return metaEl.getAttribute('href')
}
