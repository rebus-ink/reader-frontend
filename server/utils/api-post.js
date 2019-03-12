const got = require('got')
const URL = require('url').URL
const debug = require('debug')('vonnegut:utils:api-post')
let LOCAL_API = process.env.BASE

/**
 * A simple wrapper around `got` that fetches the resource using the token for auth, if available.
 *
 * At some point this needs to use configurable Keyv cache stores.
 */
async function post (url /*: string */, body /*: any */, token /*: string */) {
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
  // First we normalise the URL
  const canonicalURL = new URL(url, process.env.DOMAIN)
  // Then we convert it to the localhost if necessary
  const fullURL = new URL(canonicalURL.pathname, LOCAL_API).href
  debug(fullURL)
  try {
    const response = await got(fullURL, options)
    debug(response)
    const location = response.headers['location']
    debug(location)
    const result = await got(location, {
      headers,
      json: true,
      timeout: 1000
    })
    debug('got result')
    debug(result)
    return result.body
  } catch (error) {
    throw error
  }
}

module.exports.post = post
