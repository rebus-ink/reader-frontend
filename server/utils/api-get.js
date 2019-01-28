const got = require('got')
const debug = require('debug')('vonnegut:utils:api-get')
const URL = require('url').URL
let LOCAL_API
if (process.env.DOMAIN.includes('localhost')) {
  LOCAL_API = process.env.DOMAIN
} else {
  LOCAL_API = `http://localhost:${process.env.PORT}/api/`
}
const Datastore = require('@google-cloud/datastore')
const namespace = 'rebus-reader'
const datastore = new Datastore({
  namespace
})
const { GKeyV } = require('./gkeyv.js')
const cache = new GKeyV({ datastore })

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
    headers
  }
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    options.cache = cache
  }
  // First we normalise the URL
  const canonicalURL = new URL(url, process.env.DOMAIN)
  // Then we convert it to the localhost if necessary
  const fullURL = new URL(canonicalURL.pathname, LOCAL_API).href
  debug('full url: ', fullURL)
  let response
  try {
    response = await got(fullURL, options)
  } catch (err) {
    debug('error response: ', response)
    throw err
  }
  if (response && response.timings && response.timings.phases) {
    debug('response timings, firstByte: ', response.timings.phases.firstByte)
    debug('response timings, total: ', response.timings.phases.total)
  }
  const json = JSON.parse(response.body)
  debug('parsed JSON')
  return json
}

module.exports.get = get
