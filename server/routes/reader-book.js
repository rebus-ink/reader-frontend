const viperHTML = require('viperhtml')
const { pageBody } = require('../../views/reader-chapter.js')
const { page } = require('../../views/page.js')
const { ensureLogin } = require('../ensure-login.js')
const { getUserStreams } = require('../utils/get-user-streams.js')
const express = require('express')
const router = express.Router()
const { getBookState } = require('../utils/get-book-state.js')
const debug = require('debug')('vonnegut:routes:book')

router.get('/reader/:bookId', ensureLogin, getUserStreams, function (
  req,
  res,
  next
) {
  debug(req.path)
  return getBookState(req, res)
    .then(model => {
      debug('got model')
      const render = viperHTML.wire
      res.set('Content-Type', 'text/html')
      res.send(page(render, model, req, pageBody))
    })
    .catch(err => next(err))
})

module.exports = router
