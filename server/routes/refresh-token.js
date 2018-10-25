const express = require('express')
const router = express.Router()
const csrf = require('csurf')

// Login and logout routes
router.post('/refresh-token', csrf(), function (req, res) {
  if (req.user && req.user.token) {
    res.send({ id: req.user.readerId, token: req.user.token })
  }
})

module.exports = router
