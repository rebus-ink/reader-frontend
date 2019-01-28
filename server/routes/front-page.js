const viperHTML = require('viperhtml')
const { page } = require('../../views/page.js')
const express = require('express')
const router = express.Router()
const { getUserStreams } = require('../utils/get-user-streams.js')
const debug = require('debug')('vonnegut:routes:front-page')

router.get('/', getUserStreams, function (req, res, next) {
  const render = viperHTML.wire
  if (req.user) {
    debug(req.path)
    return res.redirect('/library')
  } else {
    res.set('Content-Type', 'text/html')
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
