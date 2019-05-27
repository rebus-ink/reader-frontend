import { getJWT } from './jwt.js'
import { HTTPError } from '../../app/utils/http-error.js'

export async function fetchWrap (...args) {
  const response = await window.fetch(...args)
  if (!response.ok) {
    throw new HTTPError('Activities Request', response.statusText, response)
  }
  return response
}

export async function get (url, context, global) {
  const JWT = await getJWT(context, global)
  try {
    const response = await fetchWrap(url, {
      headers: new window.Headers({
        'content-type': 'application/ld+json',
        Authorization: `Bearer ${JWT}`
      })
    })
    return response.json()
  } catch (err) {
    err.url = url
    throw err
  }
}
