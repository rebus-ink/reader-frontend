const passport = require('passport')
const Keyv = require('keyv')
const { authenticate } = require('./authenticate.js')
/**
 * setup
 * You need to setup session middleware before you call this. You also need to define your own `loginPath` GET routes. This does not handle user account creation.
 * @param {*} app express app
 * @param {*} strategy initialised passport strategy
 * @param {*} store keyV store
 */
function setup (app, options) {
  const {
    strategy,
    store,
    loginPath = '/login',
    logoutPath = '/logout',
    logoutRedirect = '/'
  } = options
  options.storage = new Keyv({
    uri: typeof store === 'string' && store,
    store: typeof store !== 'string' && store,
    namespace: 'rebus-reader'
  })
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
  app.use(passport.initialize())
  app.use(passport.session())
  app.post(loginPath, authenticate(options))
  app.post(logoutPath, (req, res) => {
    req.logout()
    res.redirect(logoutRedirect)
  })
  app.use(function (req, res, next) {
    req.session.nowInMinutes = Math.floor(Date.now() / 60e3)
    next()
  })
}

module.exports.setup = setup
