const { setup } = require('./server.js')
const morgan = require('morgan')
// const basicAuth = require('express-basic-auth')
const { authserver } = require('./server/auth/auth-server.js')

const Datastore = require('@google-cloud/datastore')
const namespace = 'rebus-reader'
const datastore = new Datastore({
  namespace
})
const { GKeyV } = require('./server/utils/gkeyv.js')
const accountStore = new GKeyV({ datastore })
const tokenStore = new GKeyV({ datastore })

// Auth
const Auth0Strategy = require('passport-auth0')
const strategy = new Auth0Strategy(
  {
    domain: 'rebus.auth0.com',
    clientID: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    callbackURL: `${process.env.BASE}/callback`
  },
  (accessToken, refreshToken, extraParams, profile, done) => {
    return done(null, profile)
  }
)

const app = setup(
  authserver({
    strategy,
    accountStore,
    tokenStore
  })
)

// Public staging and dev servers are locked down with a simple basic auth password
// if (
//   process.env.DEPLOY_STAGE === 'staging' ||
//   process.env.DEPLOY_STAGE === 'development'
// ) {
//   app.use(
//     basicAuth({
//       challenge: true,
//       users: { admin: process.env.DEV_PASSWORD || 'plasticfantasticsecret' }
//     })
//   )
// }

app.use(function (req, res, next) {
  const path = req.path || ''
  if (req.protocol !== 'https') {
    res.redirect(process.env.BASE + path)
  } else {
    next()
  }
})
// We only need to log errors/bans. Built-in App Engine logs are enough for the rest.
app.use(
  morgan('combined', {
    skip: function (req, res) {
      return res.statusCode < 400
    }
  })
)
const PORT = process.env.PORT || 8080
app.listen(PORT, () => console.log('Listening'))
