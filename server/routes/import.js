const viperHTML = require('viperhtml')
const { pageBody } = require('../../views/import-body.js')
const { pageHead } = require('../../views/page-head.js')
const { pageFoot } = require('../../views/page-foot.js')
const { ensureLogin } = require('../ensure-login.js')
const { getUserStreams } = require('../utils/get-user-streams.js')
const express = require('express')
const router = express.Router()

const getImportState = () => Promise.resolve({})

router.get('/library/import', ensureLogin, getUserStreams, function (
  req,
  res,
  next
) {
  return getImportState(req, res)
    .then(model => {
      const render = viperHTML.wire
      res.send(
        pageHead(render, model) +
          pageBody(render, model, req) +
          pageFoot(render, model)
      )
    })
    .catch(err => next(err))
})

module.exports = router
