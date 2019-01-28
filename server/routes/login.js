const viperHTML = require('viperhtml')
const { page } = require('../../views/page.js')
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
  res.set('Content-Type', 'text/html')
  res.send(
    page(
      render,
      {},
      req,
      () => `<div class="FrontLayout">
    <form action="/login?returnTo=/library" method="POST">
    <button class="Button">Log In</button>
    </form>
    </div>`
    )
  )
})

module.exports = router
