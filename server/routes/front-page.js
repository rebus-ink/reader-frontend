const viperHTML = require('viperhtml')
const { page } = require('../../views/page.js')
const express = require('express')
const router = express.Router()
const debug = require('debug')('vonnegut:routes:front-page')
const csurf = require('csurf')
const { ensureLogin } = require('../ensure-login.js')

router.get('/', ensureLogin, csurf(), function (req, res, next) {
  const render = viperHTML.wire
  if (req.user) {
    debug(req.path)
    return res.redirect('/library')
  } else {
    res.type('html')
    res.send(
      page(
        render,
        {},
        req,
        () => `<div class="FrontLayout">
      <form action="/login?returnTo=/library" method="POST" class="FrontLayout-child">
      <button class="Button">Log In</button>
      </form>
      </div>`
      )
    )
  }
})

module.exports = router
