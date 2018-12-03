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
  const { strategy, accountStore, tokenStore } = options
  // Storage setup
  options.storage = new Keyv({
    uri: typeof accountStore === 'string' && accountStore,
    store: typeof accountStore !== 'string' && accountStore,
    namespace: 'rebus-reader-accounts'
  })
  const tokenStorage = new Keyv({
    uri: typeof tokenStore === 'string' && tokenStore,
    store: typeof tokenStore !== 'string' && tokenStore,
    namespace: 'rebus-reader-tokens'
  })
  options.tokenStorage = tokenStorage
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
            user.id = id
            return user
          })
        })
        .then(user => {
          if (user.token) {
            return user
          } else {
            // create JWT, save in token store
            const expiresIn = '30m'
            const token = jwt.sign({ sub: id }, process.env.SECRETORKEY, {
              algorithm: 'HS256',
              expiresIn,
              jwtid: translator.new(),
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
  app.locals.authOptions = options

  app.get('/callback', authenticate, function (req, res, next) {
    res.redirect(req.session.returnTo || '/')
  })

  app.use('/', require('../routes/login.js'))
  app.use('/', require('../routes/logout.js'))
  app.use('/', require('../routes/refresh-token.js'))
  return app
}

module.exports.authserver = authserver
