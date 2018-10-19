const viperHTML = require('viperhtml')
const { pageBody } = require('../../views/page-body.js')
const { pageHead } = require('../../views/page-head.js')
const express = require('express')
const router = express.Router()

const viewModel = require('../../library-mock.json')

router.get('/library', function (req, res, next) {
  const render = viperHTML.wire
  res.send(pageHead(render, viewModel) + pageBody(render, viewModel))
})

module.exports = router
