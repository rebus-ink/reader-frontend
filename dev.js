require = require('esm')(module) // eslint-disable-line
const https = require('https')
const fs = require('fs')
const { setup } = require('./server.js')
const yaml = require('js-yaml')
const morgan = require('morgan')
const KeyvFile = require('keyv-file')
const { authserver } = require('./server/auth/auth-server.js')

// Auth
const doc = yaml.safeLoad(fs.readFileSync('./app-development.yaml', 'utf8'))
const Auth0Strategy = require('passport-auth0')
const strategy = new Auth0Strategy(
  {
    domain: 'rebus.auth0.com',
    clientID: doc.env_variables.AUTH0_CLIENT_ID,
    clientSecret: doc.env_variables.AUTH0_CLIENT_SECRET,
    callbackURL: 'https://localhost:4430/callback'
  },
  (accessToken, refreshToken, extraParams, profile, done) => {
    return done(null, profile)
  }
)
const app = setup(
  authserver({
    strategy,
    store: new KeyvFile({
      filename: `./keyv-file/default.msgpack`
    })
  })
)

app.use(morgan('dev'))

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
