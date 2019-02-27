const viperHTML = require('viperhtml')
const { pageBody } = require('../../views/render-body.js')
const { page } = require('../../views/page.js')
const { ensureLogin } = require('../ensure-login.js')
const { getUserStreams } = require('../utils/get-user-streams.js')
const express = require('express')
const router = express.Router()
const debug = require('debug')('vonnegut:routes:chapter')

router.get('/reader/:bookId/*', ensureLogin, getUserStreams, function (
  req,
  res,
  next
) {
  debug(req.path)
  const render = viperHTML.wire
  res.type('html')
  res.send(page(render, {}, req, pageBody))
})

module.exports = router
