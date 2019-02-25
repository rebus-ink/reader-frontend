const express = require('express')
const router = express.Router()

// Login and logout routes
router.post('/refresh-token', function (req, res) {
  if (req.user && req.user.token) {
    res.send({ id: req.user.readerId, token: req.user.token })
  }
})

module.exports = router
