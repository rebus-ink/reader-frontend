const express = require('express')
const router = express.Router()
const csurf = require('csurf')

router.get('/', csurf(), function (req, res, next) {
  return res.redirect('/library')
})

module.exports = router
