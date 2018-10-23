const express = require('express')
const passport = require('passport')
const { authenticate } = require('./authenticate.js')
const Keyv = require('keyv')

function authserver (options) {
  const { strategy, store } = options
  // Storage setup
  options.storage = new Keyv({
    uri: typeof store === 'string' && store,
    store: typeof store !== 'string' && store,
    namespace: 'rebus-reader-accounts'
  })
  const app = express()

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

  app.get('/callback', authenticate(options), function (req, res, next) {
    res.redirect(req.session.returnTo || '/')
  })

  app.use('/', require('../routes/login.js'))
  app.use('/', require('../routes/logout.js'))
  return app
}

module.exports.authserver = authserver
