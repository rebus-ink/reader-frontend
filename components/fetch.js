
class HTTPError extends Error {}

async function get (url) {
  const response = await window.fetch(url, {header: {}})
  if (!response.ok) {
    throw new HTTPError('Get Error:', response.statusText)
  }
  return response.json()
}

async function post (url, payload) {
  const response = await window.fetch(url, {
    method: 'POST',
    body: JSON.stringify(payload),
    header: {
      'content-type': 'application/json'
    }
  })
  if (!response.ok) {
    throw new HTTPError('POST Error:', response.statusText)
  }
  return response.json()
}

window.get = get
window.post = post
