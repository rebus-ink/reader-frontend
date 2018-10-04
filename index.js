require = require('esm')(module) // eslint-disable-line
const { start } = require('./server.js')

start(8080)
