const viperHTML = require('viperhtml')
const { page } = require('../views/login-page.js')
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
  res.type('html')
  res.send(
    page(
      render,
      {},
      req,
      render => render()`
      <div class="Login">
        <div tabindex="-1" class="Modal-overlay">
        <div role="dialog" class="Modal-container" aria-modal="true" aria-labelledby="modal-1-title" >
          <header>
            <h2 id="modal-1-title" class="Modal-title">
              Sign In
            </h2>
            <button aria-label="Close modal" class="Modal-close App-button"></button>
          </header>
          <div id="modal-1-content" class="Modal-content">
            <p class="Modal-text">Sign in to use Rebus Ink</p>
          <div class="Modal-row">
            <span></span>
            <form action="/login?returnTo=/library" method="POST">
        <button class="TextButton">Sign In</button>
        </form></div>
          </div>
        </div>
      </div>
      </div>`
    )
  )
})

module.exports = router
