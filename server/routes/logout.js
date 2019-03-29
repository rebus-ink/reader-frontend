const viperHTML = require('viperhtml')
const { page } = require('../../views/login-page.js')
const express = require('express')
const router = express.Router()
const debug = require('debug')('vonnegut:routes:import')
const { ensureLogin } = require('../ensure-login.js')
const csurf = require('csurf')

router.get('/logout', function (req, res, next) {
  const render = viperHTML.wire
  debug('rendering logout')
  res.type('html')
  res.send(
    page(
      render,
      {},
      req,
      render => render()`<div class="FrontLayout"><form action="/logout" method="POST" class="FrontLayout-child">
      <button class="Button">Log Out</button>
      </form></div>`
    )
  )
})
router.post('/logout', ensureLogin, csurf(), (req, res) => {
  req.session = null
  req.logout()
  res.redirect('/')
})

module.exports = router
