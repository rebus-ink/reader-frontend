const https = require('https')
const fs = require('fs')
const { app } = require('./server.js')

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
