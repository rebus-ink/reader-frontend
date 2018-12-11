const viperHTML = require('viperhtml')
const { pageBody } = require('../../views/reader-chapter.js')
const { pageHead } = require('../../views/page-head.js')
const { pageFoot } = require('../../views/page-foot.js')
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
      res.send(
        pageHead(render, model, req) +
          pageBody(render, model, req) +
          pageFoot(render, model)
      )
    })
    .catch(err => next(err))
})

module.exports = router
