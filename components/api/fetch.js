import { HTTPError } from '../../app/utils/http-error.js'

export async function fetchWrap (...args) {
  const response = await window.fetch(...args)
  if (!response.ok) {
    throw new HTTPError('Activities Request', response.statusText, response)
  }
  return response
}

export async function get (url, context, global) {
  try {
    const response = await fetchWrap(url, {
      credentials: 'include',
      headers: new window.Headers({
        'content-type': 'application/ld+json'
      })
    })
    return response.json()
  } catch (err) {
    err.url = url
    throw err
  }
}
