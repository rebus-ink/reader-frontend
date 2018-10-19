'use strict'
require = require('esm')(module) // eslint-disable-line
const express = require('express')
const app = express()
const compression = require('compression')
// const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn
const basicAuth = require('express-basic-auth')
const { securitySetup } = require('./server/security.js')

// Public staging and dev servers are locked down with a simple basic auth password
if (
  process.env.DEPLOY_STAGE === 'staging' ||
  process.env.DEPLOY_STAGE === 'development'
) {
  app.use(
    basicAuth({
      challenge: true,
      users: { admin: process.env.DEV_PASSWORD || 'plasticfantasticsecret' }
    })
  )
}

securitySetup(app)

// Basic Settings
app.enable('strict routing')
app.set('trust proxy', true)
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(compression())
app.use('/static', express.static('static'))

// Routes
app.use('/', require('./server/routes/front-page.js'))
app.use('/', require('./server/routes/library.js'))

app.use(function (req, res, next) {
  res.status(404)
  res.send('Not Found')
})

app.use(function errorHandler (err, req, res, next) {
  console.error(err.stack)
  if (res.headersSent) {
    return next(err)
  }
  res.format({
    'text/html': function () {
      return res.status(err.statusCode || 500).send('not found')
    },
    'application/json': function () {
      return res.sendStatus(err.statusCode || 500)
    }
  })
})

module.exports = {
  app
}
