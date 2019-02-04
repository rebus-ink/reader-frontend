const viperHTML = require('viperhtml')
const { pageBody } = require('../../views/library-body.js')
const { page } = require('../../views/page.js')
const { ensureLogin } = require('../ensure-login.js')
const { getUserStreams } = require('../utils/get-user-streams.js')
const express = require('express')
const router = express.Router()
const { getLibraryState } = require('../utils/get-library-state.js')
const debug = require('debug')('vonnegut:routes:library')

router.get('/library', ensureLogin, getUserStreams, function (req, res, next) {
  debug(req.path)
  return getLibraryState(req, res)
    .then(model => {
      debug('got model')
      const render = viperHTML.wire
      res.type('html')
      res.send(page(render, model, req, pageBody))
    })
    .catch(err => next(err))
})

module.exports = router
