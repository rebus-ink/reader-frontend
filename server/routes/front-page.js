const viperHTML = require('viperhtml')
const { pageBody } = require('../views/render-body.js')
const { page } = require('../views/page.js')
const express = require('express')
const router = express.Router()
const debug = require('debug')('vonnegut:routes:front-page')
const csurf = require('csurf')
const { ensureLogin } = require('../ensure-login.js')

router.get('/', ensureLogin, csurf(), function (req, res, next) {
  if (req.user) {
    debug(req.path)
    return res.redirect('/library')
  } else {
    debug(req.path)
    const render = viperHTML.wire
    res.type('html')
    res.send(page(render, {}, req, pageBody))
  }
})

module.exports = router
