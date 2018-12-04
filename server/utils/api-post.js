// @flow
const got = require('got')

/**
 * A simple wrapper around `got` that fetches the resource using the token for auth, if available.
 *
 * At some point this needs to use configurable Keyv cache stores.
 */
async function post (url /*: string */, body/*: any */, token /*: string */) {
  console.log(`${process.env.DOMAIN}/api${url}`, body, token)
  let headers
  if (token) {
    headers = {
      Authorization: 'Basic ' + token
    }
  }
  const options = {
    headers,
    method: 'POST',
    body: JSON.stringify(body),
    json: true,
    timeout: 1000
  }
  try {
    const response = await got(`${process.env.DOMAIN}/api${url}`, options)
    const location = response.headers['location']
    const result = await got(location, {
      headers,
      json: true,
      timeout: 1000
    })
    return result.body
  } catch (error) {
    console.error(error)
    return null
  }
}

module.exports.post = post
