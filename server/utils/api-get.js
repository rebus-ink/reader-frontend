// @flow
const got = require('got')
const debug = require('debug')('vonnegut:utils:api-get')
const URL = require('url').URL

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
  const fullURL = new URL(url, process.env.DOMAIN).href
  debug(fullURL, token)
  let response
  try {
    response = await got(fullURL, options)
  } catch (err) {
    debug(err)
    debug(response)
  }
  return response.body
}

module.exports.get = get
