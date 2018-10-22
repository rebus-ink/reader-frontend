const https = require('https')
const fs = require('fs')
const { app } = require('./server.js')
const { authSetup } = require('./server/auth/setup')
const yaml = require('js-yaml')
const morgan = require('morgan')
app.use(morgan('dev'))

const doc = yaml.safeLoad(fs.readFileSync('./app-development.yaml', 'utf8'))

// Auth
const Auth0Strategy = require('passport-auth0')
const strategy = new Auth0Strategy(
  {
    domain: 'rebus.auth0.com',
    clientID: doc.env_variables.AUTH0_CLIENT_ID,
    clientSecret: doc.env_variables.AUTH0_CLIENT_SECRET,
    callbackURL: 'https://localhost:4430/login'
  },
  (accessToken, refreshToken, extraParams, profile, done) => {
    return done(null, profile)
  }
)

authSetup(app, { strategy })

const options = {
  key: fs.readFileSync('./dev/localhost.key'),
  cert: fs.readFileSync('./dev/localhost.cert'),
  requestCert: false,
  rejectUnauthorized: false
}

const port = 4430
const server = https.createServer(options, app)

server.listen(port, function () {
  console.log('Express server listening on port ' + server.address().port)
})
