const viperHTML = require('viperhtml')
const { pageHead } = require('../../views/page-head.js')
const { pageFoot } = require('../../views/page-foot.js')
const passport = require('passport')
const express = require('express')
const router = express.Router()

// Login and logout routes
router.post(
  '/login',
  function (req, res, next) {
    if (req.query.returnTo) {
      req.session.returnTo = req.query.returnTo
    }
    next()
  },
  passport.authenticate('auth0', { failureRedirect: '/login' })
)
router.get('/login', function (req, res, next) {
  if (req.user) {
    res.redirect(req.session.returnTo || '/')
  }
  const render = viperHTML.wire
  res.send(
    pageHead(render, {}, req) +
      `<div class="FrontLayout">
  <form action="/login?returnTo=/library" method="POST">
  <button class="Button">Log In</button>
  </form>
  </div>` +
      pageFoot(render)
  )
})

module.exports = router
