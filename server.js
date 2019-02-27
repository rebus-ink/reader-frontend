'use strict'
const express = require('express')
const compression = require('compression')
const cookieSession = require('cookie-session')
// const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn
const { securitySetup } = require('./server/security.js')
const debug = require('debug')('vonnegut:server')
if (!process.env.DOMAIN) {
  process.env.DOMAIN = process.env.BASE
}
function setup (authserver) {
  const app = express()
  securitySetup(app)

  // Basic Settings
  app.enable('strict routing')
  app.disable('x-powered-by')
  app.set('trust proxy', true)
  // Cookie Session
  app.use(
    cookieSession({
      name: 'sod',
      keys: [process.env.COOKIE_KEY || '4FAC5133-2641-4745-9D58-2187C37B8116'],
      secure: true,
      maxAge: 24 * 60 * 60 * 1000
    })
  )
  app.use(express.urlencoded({ extended: true }))
  app.use(express.json())
  app.use(compression())
  app.use('/static', express.static('static'))
  app.use('/js', express.static('js'))
  app.use('/app', express.static('app'))

  // Make sure the session doesn't expire as long as there is activity
  app.use(function (req, res, next) {
    req.session.nowInMinutes = Math.floor(Date.now() / 60e3)
    next()
  })
  app.use(authserver)

  // Routes
  const csurf = require('csurf')
  app.use('/', csurf(), require('./server/routes/front-page.js'))
  app.use('/', csurf(), require('./server/routes/library.js'))
  app.use('/', csurf(), require('./server/routes/settings.js'))
  app.use('/', csurf(), require('./server/routes/notes.js'))
  app.use('/', csurf(), require('./server/routes/import.js'))
  app.use('/', csurf(), require('./server/routes/info-card.js'))
  app.use('/', csurf(), require('./server/routes/reader-book.js'))
  app.use('/', csurf(), require('./server/routes/reader-chapter.js'))
  app.use('/', csurf(), require('./server/routes/process-chapter.js'))
  app.use('/', csurf(), require('./server/routes/refresh-token.js'))

  const apiApp = require('./reader-api/server.js').app
  app.use('/', apiApp) // This requires multer, @google-cloud/storage, sqlite objection knex pg objection-db-errors objection-guid debug lodash dotenv passport-jwt

  apiApp.initialize().catch(err => {
    debug(err)
    throw err
  })
  app.use(function (req, res, next) {
    res.status(404)
    res.send('Not Found')
  })

  app.use(require('./server/error-handler.js').errorHandler)
  return app
}

module.exports = {
  setup
}
