const { ensureLogin } = require('../ensure-login.js')
const express = require('express')
const router = express.Router()
const csurf = require('csurf')
const Mercury = require('@postlight/mercury-parser')
const got = require('got')
const debug = require('debug')('vonnegut:routes:process-url')
const Microformats = require('microformat-node')

router.post('/process-url', ensureLogin, csurf(), function (req, res, next) {
  debug(req.query)
  const url = req.query.url
  debug(url)
  return processURL(url)
    .then(result => res.send(result))
    .catch(err => next(err))
})

const options = {
  headers: {
    accept: 'text/html, application/xhtml+xml, application/xml;q=0.9, */*;q=0.8'
  }
}

async function processURL (url) {
  let response
  try {
    response = await got(url, options)
  } catch (err) {
    debug('error response: ', err)
    return null
  }
  const html = await response.body
  const mercury = await Mercury.parse(url, { html })
  const microformats = await Microformats.getAsync({
    html,
    baseUrl: url,
    textFormat: 'normalised'
  })
  debug(`result for ${url}`)
  return { html, mercury, microformats, url }
}

module.exports = router
