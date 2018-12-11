// @flow
const got = require('got')
const URL = require('url').URL
const debug = require('debug')('vonnegut:utils:api-post')
let LOCAL_API
if (process.env.DOMAIN.includes('localhost')) {
  LOCAL_API = process.env.DOMAIN
} else {
  LOCAL_API = `http://localhost:${process.env.PORT}/api/`
}

/**
 * A simple wrapper around `got` that fetches the resource using the token for auth, if available.
 *
 * At some point this needs to use configurable Keyv cache stores.
 */
async function post (url /*: string */, body/*: any */, token /*: string */) {
  let headers
  if (token) {
    headers = {
      Authorization: 'Bearer ' + token
    }
  }
  const options = {
    headers,
    method: 'POST',
    body: JSON.stringify(body),
    timeout: 1000
  }
  try {
    // First we normalise the URL
    const canonicalURL = new URL(url, process.env.DOMAIN)
    // Then we convert it to the localhost if necessary
    const fullURL = new URL(canonicalURL.pathname, LOCAL_API).href
    debug(fullURL)
    const response = await got(fullURL, options)
    const location = response.headers['location']
    const result = await got(location, {
      headers,
      json: true,
      timeout: 1000
    })
    debug(result)
    return result.body
  } catch (error) {
    throw error
  }
}

module.exports.post = post
