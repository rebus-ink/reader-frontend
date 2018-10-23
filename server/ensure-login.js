const viperHTML = require('viperhtml')
const { pageHead } = require('../views/page-head.js')
const { pageFoot } = require('../views/page-foot.js')
const { login } = require('../views/login.js')

function ensureLogin (req, res, next) {
  const render = viperHTML.wire
  if (req.user && req.user.email.endsWith('@rebus.foundation')) {
    next()
  } else if (req.user) {
    req.session = null
    req.logout()
    res.redirect('/')
  } else {
    res.send(
      pageHead(render, { returnTo: req.path }) +
        login(render({ returnTo: req.path })) +
        pageFoot(render, { returnTo: req.path })
    )
  }
}

module.exports.ensureLogin = ensureLogin
