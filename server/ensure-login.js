const viperHTML = require('viperhtml')
const { page } = require('./views/login-page.js')
const { login } = require('./views/login.js')

function ensureLogin (req, res, next) {
  const render = viperHTML.wire
  if (req.user) {
    next()
  } else {
    res.type('html')
    res.send(page(render, { returnTo: req.path }, req, login).toString())
  }
}

module.exports.ensureLogin = ensureLogin
