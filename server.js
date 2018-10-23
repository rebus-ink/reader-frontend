'use strict'
require = require('esm')(module) // eslint-disable-line
const express = require('express')
const compression = require('compression')
const cookieSession = require('cookie-session')
// const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn
const { securitySetup } = require('./server/security.js')
const passport = require('passport')
const Keyv = require('keyv')
const { authenticate } = require('./server/auth/authenticate.js')
const viperHTML = require('viperhtml')
const { pageHead } = require('./views/page-head.js')
const { pageFoot } = require('./views/page-foot.js')

function setup (options) {
  const { strategy, store } = options
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

  // Storage setup
  options.storage = new Keyv({
    uri: typeof store === 'string' && store,
    store: typeof store !== 'string' && store,
    namespace: 'rebus-reader-accounts'
  })

  // Passport setup
  passport.use(strategy)
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })
  passport.deserializeUser((id, done) => {
    return options.storage
      .get(id)
      .then(user => {
        if (user) {
          done(null, user)
        } else {
          done(null, { id })
        }
      })
      .catch(err => {
        done(err)
      })
  })
  app.use(passport.initialize())
  app.use(passport.session())

  // Login and logout routes
  app.post(
    '/login',
    function (req, res, next) {
      if (req.query.returnTo) {
        req.session.returnTo = req.query.returnTo
      }
      next()
    },
    passport.authenticate('auth0', { failureRedirect: '/login' })
  )
  app.get('/login', function (req, res, next) {
    if (req.user) {
      res.redirect(req.session.returnTo || '/')
    }
    const render = viperHTML.wire
    res.send(
      pageHead(render) +
        `<div class="FrontLayout">
    <form action="/login?returnTo=/library" method="POST">
    <button class="Button">Log In</button>
    </form>
    </div>` +
        pageFoot(render)
    )
  })
  app.get('/callback', authenticate(options), function (req, res, next) {
    res.redirect(req.session.returnTo || '/')
  })

  // Make sure the session doesn't expire as long as there is activity
  app.use(function (req, res, next) {
    req.session.nowInMinutes = Math.floor(Date.now() / 60e3)
    next()
  })

  // Routes
  app.use('/', require('./server/routes/logout.js'))
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
  return app
}

module.exports = {
  setup
}
