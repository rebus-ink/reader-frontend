const viperHTML = require('viperhtml')
const { pageBody } = require('../../views/settings-body.js')
const { pageHead } = require('../../views/page-head.js')
const { pageFoot } = require('../../views/page-foot.js')
const { ensureLogin } = require('../ensure-login.js')
const { getUserStreams } = require('../utils/get-user-streams.js')
const express = require('express')
const router = express.Router()
const getSettingsState = () => Promise.resolve({})

router.get('/library/settings', ensureLogin, getUserStreams, function (
  req,
  res,
  next
) {
  return getSettingsState(req, res)
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
