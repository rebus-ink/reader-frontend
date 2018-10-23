const express = require('express')
const passport = require('passport')
const { authenticate } = require('./authenticate.js')
const Keyv = require('keyv')
const jwt = require('jsonwebtoken')
const ms = require('ms')
const short = require('short-uuid')
const translator = short()

function authserver (options) {
  // Need an oauth=false option that tells us to do the authentication processing in the login route instead of the callback route
  const { strategy, store } = options
  // Storage setup
  options.storage = new Keyv({
    uri: typeof store === 'string' && store,
    store: typeof store !== 'string' && store,
    namespace: 'rebus-reader-accounts'
  })
  const tokenStorage = new Keyv({
    uri: typeof store === 'string' && store,
    store: typeof store !== 'string' && store,
    namespace: 'rebus-reader-tokens'
  })
  const app = express()

  // Passport setup
  passport.use(strategy)
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })
  passport.deserializeUser((id, done) => {
    // This function should be extracted and unit tested
    return (
      options.storage
        .get(id)
        // Get JWT from namespaced token store
        .then((user = {}) => {
          return tokenStorage.get(id).then(token => {
            user.token = token
            return user
          })
        })
        .then(user => {
          if (user.token) {
            return user
          } else {
            // create JWT, save in token store
            const { readerId } = user
            const expiresIn = '30m'
            const token = jwt({ sub: readerId }, process.env.SECRETORKEY, {
              algorithm: 'HS256',
              expiresIn,
              jwtId: translator.new(),
              audience: process.env.AUDIENCE,
              issuer: process.env.ISSUER
            })
            return tokenStorage.set(id, token, ms(expiresIn)).then(() => {
              user.token = token
              return user
            })
          }
        })
        .then(user => {
          if (user) {
            done(null, user)
          } else {
            done(null, { id, guest: true })
          }
        })
        .catch(err => {
          done(err)
        })
    )
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
