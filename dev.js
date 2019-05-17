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
    domain: doc.env_variables.AUTH0_DOMAIN,
    clientID: doc.env_variables.AUTH0_CLIENT_ID,
    clientSecret: doc.env_variables.AUTH0_CLIENT_SECRET,
    callbackURL: 'https://localhost:4430/callback'
  },
  (accessToken, refreshToken, extraParams, profile, done) => {
    return done(null, profile)
  }
)

process.env.SECRETORKEY = doc.env_variables.SECRETORKEY
process.env.ISSUER = doc.env_variables.ISSUER
process.env.AUDIENCE = doc.env_variables.AUDIENCE
process.env.AUTH0_DOMAIN = doc.env_variables.AUTH0_DOMAIN
process.env.AUTH0_CLIENT_ID = doc.env_variables.AUTH0_CLIENT_ID
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0

const app = setup(
  authserver({
    strategy,
    accountStore: new KeyvFile({
      filename: `./keyv-file/default.msgpack`
    }),
    tokenStore: new KeyvFile({
      filename: `./keyv-file/default-tokens.msgpack`
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
