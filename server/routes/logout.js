const express = require('express')
const router = express.Router()
const { ensureLogin } = require('../ensure-login.js')
const csurf = require('csurf')

router.post('/logout', ensureLogin, csurf(), (req, res) => {
  req.session = null
  req.logout()
  res.redirect(
    `https://${process.env.AUTH0_DOMAIN}/v2/logout?client_id=${
      process.env.AUTH0_CLIENT_ID
    }&returnTo=${process.env.BASE}/`
  )
})

module.exports = router
