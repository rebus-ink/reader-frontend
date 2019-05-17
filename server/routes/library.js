const viperHTML = require('viperhtml')
const { pageBody } = require('../views/render-body.js')
const { page } = require('../views/page.js')
const { ensureLogin } = require('../ensure-login.js')
const express = require('express')
const router = express.Router()
const debug = require('debug')('vonnegut:routes:library')
const csurf = require('csurf')

router.get('/library/:bookId?', ensureLogin, csurf(), function (req, res, next) {
  debug(req.path)
  const render = viperHTML.wire
  res.type('html')
  res.send(page(render, {}, req, pageBody))
})

module.exports = router
