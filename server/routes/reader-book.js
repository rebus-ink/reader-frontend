const express = require('express')
const router = express.Router()
const debug = require('debug')('vonnegut:routes:book')
const csurf = require('csurf')
const path = require('path')

router.get('/reader/:bookId/*', csurf(), function (req, res, next) {
  debug(req.path)
  res.type('html')
  res.sendFile(path.join(__dirname, '../../html/index.html'))
})

module.exports = router
