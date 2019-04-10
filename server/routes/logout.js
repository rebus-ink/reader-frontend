const express = require('express')
const router = express.Router()
const { ensureLogin } = require('../ensure-login.js')
const csurf = require('csurf')

router.post('/logout', ensureLogin, csurf(), (req, res) => {
  req.session = null
  req.logout()
  res.redirect('/')
})

module.exports = router
