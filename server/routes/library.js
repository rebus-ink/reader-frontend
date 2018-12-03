const viperHTML = require('viperhtml')
const { pageBody } = require('../../views/library-body.js')
const { pageHead } = require('../../views/page-head.js')
const { pageFoot } = require('../../views/page-foot.js')
const { ensureLogin } = require('../ensure-login.js')
const { getUserStreams } = require('../utils/get-user-streams.js')
const express = require('express')
const router = express.Router()
const { getLibraryState } = require('../utils/get-library-state.js')

const viewModel = require('../../library-mock.json')

router.get('/library', ensureLogin, getUserStreams, function (req, res, next) {
  return getLibraryState(req, res)
    .then(model => {
      model = model || viewModel
      const render = viperHTML.wire
      res.send(
        pageHead(render, viewModel, req) +
          pageBody(render, viewModel, req) +
          pageFoot(render, viewModel)
      )
    })
    .catch(err => next(err))
})

module.exports = router
