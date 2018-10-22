const { app } = require('./server.js')
const morgan = require('morgan')
const basicAuth = require('express-basic-auth')
const { authSetup } = require('./server/auth/setup')

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

// Auth
const Auth0Strategy = require('passport-auth0')
const strategy = new Auth0Strategy(
  {
    domain: 'rebus.auth0.com',
    clientID: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    callbackURL: `${process.env.DOMAIN}/login`
  },
  (accessToken, refreshToken, extraParams, profile, done) => {
    return done(null, profile)
  }
)

authSetup(app, { strategy })

app.use(function (req, res, next) {
  const path = req.path || ''
  if (req.protocol !== 'https') {
    res.redirect(process.env.DOMAIN + path)
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
app.listen(8080, () => console.log('Listening'))
