const viperHTML = require('viperhtml')
const { pageBody } = require('../../views/library-body.js')
const { pageHead } = require('../../views/page-head.js')
const { pageFoot } = require('../../views/page-foot.js')
const { ensureLogin } = require('../ensure-login.js')
const { getUserStreams } = require('../utils/get-user-streams.js')
const express = require('express')
const router = express.Router()
const { getLibraryState } = require('../utils/get-library-state.js')
const debug = require('debug')('vonnegut:routes:library')

router.get('/library', ensureLogin, getUserStreams, function (req, res, next) {
  debug(req.user)
  return getLibraryState(req, res)
    .then(model => {
      debug(model)
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
