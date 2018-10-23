const passport = require('passport')
const Keyv = require('keyv')
const { authenticate } = require('../auth/authenticate.js')
const express = require('express')
const viperHTML = require('viperhtml')
const { pageHead } = require('../../views/page-head.js')
const { pageFoot } = require('../../views/page-foot.js')
/**
 * setup
 * You need to setup session middleware before you call this. You also need to define your own `loginPath` GET routes. This does not handle user account creation.
 * @param {*} app express app
 * @param {*} strategy initialised passport strategy
 * @param {*} store keyV store
 */
function authRouter (options) {
  const router = express.Router()
  const { strategy, store, logoutRedirect = '/' } = options

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
      .then(user => done(null, user))
      .catch(err => done(err))
  })
  router.use(passport.initialize())
  router.use(passport.session())

  // Login and logout routes
  router.post('/login', authenticate(options))
  router.post('/logout', (req, res) => {
    req.logout()
    req.session = null
    res.redirect(logoutRedirect)
  })

  // Make sure the session doesn't expire as long as there is activity
  router.use(function (req, res, next) {
    req.session.nowInMinutes = Math.floor(Date.now() / 60e3)
    next()
  })
  router.get('/login', function (req, res, next) {
    if (req.user) {
      res.redirect(req.session.returnTo || '/')
    }
    const render = viperHTML.wire
    res.send(
      pageHead(render) +
        `<div class="FrontLayout">
    <form action="/login" method="POST">
    <button class="Button">Log In</button>
    </form>
    </div>` +
        pageFoot(render)
    )
  })
  return router
}

module.exports.authRouter = authRouter
