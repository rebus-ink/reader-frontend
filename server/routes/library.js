const viperHTML = require('viperhtml')
const { pageBody } = require('../../views/library-body.js')
const { pageHead } = require('../../views/page-head.js')
const { pageFoot } = require('../../views/page-foot.js')
const { ensureLogin } = require('../ensure-login.js')
const express = require('express')
const router = express.Router()

const viewModel = require('../../library-mock.json')

router.get('/library', ensureLogin, function (req, res, next) {
  const render = viperHTML.wire
  res.send(
    pageHead(render, viewModel) +
      pageBody(render, viewModel) +
      pageFoot(render, viewModel)
  )
})

module.exports = router
