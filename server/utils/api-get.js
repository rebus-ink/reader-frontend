// @flow
const got = require('got')

/**
 * A simple wrapper around `got` that fetches the resource using the token for auth, if available.
 *
 * At some point this needs to use configurable Keyv cache stores.
 */
async function get (url /*: string */, token /*: string */) {
  let headers
  if (token) {
    headers = {
      Authorization: 'Basic ' + token
    }
  }
  const options = {
    headers,
    json: true,
    timeout: 1000
  }
  try {
    const response = await got(url, options)
    return response.body
  } catch (error) {
    console.error(error)
    return null
  }
}

module.exports.get = get
