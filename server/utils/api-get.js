// @flow
const got = require('got')
const debug = require('debug')('vonnegut:utils:api-get')
const URL = require('url').URL
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
async function get (url /*: string */, token /*: string */) {
  let headers
  if (token) {
    headers = {
      Authorization: 'Bearer ' + token
    }
  }
  const options = {
    headers,
    json: true,
    timeout: 1000
  }
  // First we normalise the URL
  const canonicalURL = new URL(url, process.env.DOMAIN)
  // Then we convert it to the localhost if necessary
  const fullURL = new URL(canonicalURL.pathname, LOCAL_API).href
  debug(fullURL, token)
  let response
  try {
    response = await got(fullURL, options)
  } catch (err) {
    debug(response)
    throw err
  }
  return response.body
}

module.exports.get = get
