const express = require('express')
const router = express.Router()
const debug = require('debug')('vonnegut:routes:library')
const csurf = require('csurf')
const path = require('path')

router.get('/library/:bookId?', csurf(), function (req, res, next) {
  debug(req.path)
  res.type('html')
  res.sendFile(path.join(__dirname, '../../html/index.html'))
})
router.get('/info/:bookId?', csurf(), function (req, res, next) {
  debug(req.path)
  res.type('html')
  res.sendFile(path.join(__dirname, '../../html/index.html'))
})

module.exports = router
